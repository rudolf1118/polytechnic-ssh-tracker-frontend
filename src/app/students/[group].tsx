'use client'

import { useEffect, useState } from "react";
import { studentApi } from "@/api/student/student.api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/Protected";

export default function StudentsPageByGroup() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAllActivities, setShowAllActivities] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);
    const router = useRouter();

    const fetchStudents = async (group: "lab-1" | "lab-2" | "lab-3" | "lab-4" | "all") => {
        try {
            setLoading(true);
            const res = await studentApi.getStudentsByGroup(group);
            setStudents(res);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full mt-5">
            {loading && <LoadingScreen/>}
            <div className="w-full max-w-6xl flex items-center justify-center">
                <input type="text" placeholder="Search" className="w-full max-w-6xl p-2 rounded-lg bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700 text-white" />
                <button className="bg-blue-900 dark:bg-blue-800 light-black:bg-blue-700 text-white px-4 py-2 rounded-lg">Search</button>
                <div className="w-full max-w-6xl flex items-center justify-center">
                    <select 
                        name="group" 
                        id="group" 
                        className="w-full max-w-6xl p-2 rounded-lg bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700 text-white"
                        onChange={async (e) => await fetchStudents(e.target.value as "lab-1" | "lab-2" | "lab-3" | "lab-4" | "all")}
                    >
                        <option value="all">All</option>
                        <option value="lab-1">Lab 1</option>
                        <option value="lab-2">Lab 2</option>
                        <option value="lab-3">Lab 3</option>
                        <option value="lab-4">Lab 4</option>
                    </select>
                </div>
            </div>
            <div className="w-full max-w-6xl overflow-hidden mt-5 shadow-inner rounded-lg">
                <div className="w-full text-white">
                    {students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {students.map((student: any, index: number) => (
                                <div key={student._id || index} className="flex bg-black dark:bg-gray-900 light-black:bg-gray-800 flex-col divide-y divide-gray-800 light-black:divide-gray-700 bg-gradient-to-r transition-all duration-500 transform hover:scale-[1.03] rounded-xl overflow-hidden shadow-lg cursor-pointer group relative"
                                    onClick={() => router.push(`/profile/${student._id}`)}>
                                    <div className="absolute inset-0 bg-opacity-70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                                        <p className="text-white text-xl font-bold">Click to see {student?.firstNameEN}'s profile</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700">Username</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.username}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700">First Name (AM)</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.firstNameAM}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700">Last Name (AM)</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.lastNameAM}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700">First Name (EN)</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.firstNameEN}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700">Last Name (EN)</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.lastNameEN}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700">Group</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.group}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700">ID</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?._id}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !loading && (
                        <div className="p-8 text-center text-lg">
                            No students found
                        </div>
                    )}
                </div>
            </div>
        </div>
        </ProtectedRoute>
    )
}