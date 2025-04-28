'use client'

import { useEffect, useState } from "react";
import { studentApi } from "@/api/student/student.api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/Protected";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "@/context/AuthContext";

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const { role } = useAuth();
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAllActivities, setShowAllActivities] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);
    const router = useRouter();
    const [search, setSearch] = useState<string>("");
    const [currentGroup, setCurrentGroup] = useState<"lab-1" | "lab-2" | "lab-3" | "lab-4" | "" | "all">("");

    const fetchStudents = async (group: "lab-1" | "lab-2" | "lab-3" | "lab-4" | "" | "all" = role === 'admin' ? "all" : "") => {
        try {
            setLoading(true);
            setCurrentGroup(group);
            const res = await studentApi.getStudentsByGroup(group);
            setStudents(res);
            setFilteredStudents([]);
            setSearch("");
        } catch (error) {
            console.error("Failed to fetch students:", error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm);
        if (!searchTerm.trim()) {
            setFilteredStudents([]);
            return;
        }
        
        const filtered = students.filter((student: any) => 
            (student.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.firstNameEN?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.lastNameEN?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.firstNameAM?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.lastNameAM?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.group?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student._id?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
        
        setFilteredStudents(filtered);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Determine which students to display
    const displayStudents = search.trim() ? filteredStudents : students;

    return (
        <ProtectedRoute>
            <AnimatePresence>
                <motion.div
                    className="flex flex-col items-center justify-center min-h-screen p-4 w-full bg-light-bg dark:bg-dark-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {loading && <LoadingScreen />}
                    <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={search}
                            className="w-full sm:w-2/3 p-2 rounded-lg bg-light-secondary dark:bg-dark-secondary text-light-foreground dark:text-dark-foreground border border-gray-300 focus:border-light-primary dark:focus:border-dark-primary transition-all duration-300 focus:outline-none" 
                            onChange={(e) => handleSearch(e.target.value)} 
                        />
                        <motion.select 
                            name="group" 
                            id="group" 
                            value={currentGroup}
                            className="w-full sm:w-1/3 p-2 rounded-lg bg-light-secondary dark:bg-dark-secondary text-light-foreground dark:text-dark-foreground"
                            onChange={async (e) => {
                                const selectedGroup = e.target.value as "lab-1" | "lab-2" | "lab-3" | "lab-4" | "" | "all";
                                setCurrentGroup(selectedGroup);
                                await fetchStudents(selectedGroup);
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {role === 'admin' ? (
                                <>
                                    <option value="all">All</option>
                                    <option value="lab-1">Lab 1</option>
                                    <option value="lab-2">Lab 2</option>
                                    <option value="lab-3">Lab 3</option>
                                    <option value="lab-4">Lab 4</option>
                                </>
                            ) : (
                                <>
                                    <option value="">My Group</option>
                                    <option value="lab-1">Lab 1</option>
                                    <option value="lab-2">Lab 2</option>
                                    <option value="lab-3">Lab 3</option>
                                    <option value="lab-4">Lab 4</option>
                                </>
                            )}
                        </motion.select>
                        <button 
                            className="bg-light-primary dark:bg-dark-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-light-accent dark:hover:bg-dark-accent transition-colors w-full sm:w-auto" 
                            onClick={() => handleSearch(search)}
                        >
                            Search
                        </button>
                    </div>
                    <div className="w-full max-w-6xl overflow-hidden mt-5 shadow-inner rounded-lg">
                        <div className="w-full text-light-foreground dark:text-dark-foreground">
                            {displayStudents.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {displayStudents.map((student: any, index: number) => (
                                        <motion.div 
                                            key={student._id || index} 
                                            className="bg-light-secondary dark:bg-dark-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group relative"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div 
                                                className="absolute inset-0 bg-opacity-75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10"
                                                onClick={() => router.push(`/profile/${student._id}`)}
                                            >
                                                <p className="text-light-foreground dark:text-dark-foreground text-lg font-bold">View {student.firstNameEN}'s profile</p>
                                            </div>
                                            
                                            {/* Card Header */}
                                            <div className="bg-light-primary dark:bg-dark-primary px-3 py-2 text-white">
                                                <h3 className="font-medium truncate">{student?.firstNameEN} {student?.lastNameEN}</h3>
                                            </div>
                                            
                                            {/* Card Content */}
                                            <div className="p-3 text-light-foreground dark:text-dark-foreground text-sm">
                                                <div className="flex justify-between border-b border-gray-300 py-1">
                                                    <span className="text-gray-600 dark:text-gray-400">Username:</span>
                                                    <span className="font-medium truncate">{student?.username}</span>
                                                </div>
                                                
                                                <div className="flex justify-between border-b border-gray-300 py-1">
                                                    <span className="text-gray-600 dark:text-gray-400">Group:</span>
                                                    <span className="font-medium">{student?.group}</span>
                                                </div>
                                                
                                                <div className="flex justify-between py-1">
                                                    <span className="text-gray-600 dark:text-gray-400">ID:</span>
                                                    <span className="font-medium text-xs truncate">{student?._id}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : !loading && (
                                <motion.div 
                                    className="p-8 text-center text-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    No students found
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </ProtectedRoute>
    )
}