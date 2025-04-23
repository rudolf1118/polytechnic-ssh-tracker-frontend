'use client'

import { useEffect, useState } from "react";
import { studentApi } from "@/api/student/student.api";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAllActivities, setShowAllActivities] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const res = await studentApi.getStudentsByGroup();
                setStudents(res);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleToggleActivities = () => {
        setAnimating(true);
        setTimeout(() => {
            setShowAllActivities(!showAllActivities);
            setAnimating(false);
        }, 200);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {loading && <LoadingScreen/>}
            <div className="w-full max-w-6xl overflow-hidden mt-5 shadow-inner rounded-lg">
                <div className="w-full text-white">
                    {students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {students.map((student: any, index: number) => (
                                <div key={student._id || index} className="flex bg-black flex-col divide-y divide-gray-800 bg-gradient-to-r transition-all duration-500 transform hover:scale-[1.03] rounded-lg">
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900">Username</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.username}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900">First Name (AM)</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.firstNameAM}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900">Last Name (AM)</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.lastNameAM}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900">First Name (EN)</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.firstNameEN}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900">Last Name (EN)</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.lastNameEN}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900">Group</div>
                                        <div className="px-4 py-3 whitespace-nowrap w-full text-lg">{student?.group}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider w-full bg-gray-900">ID</div>
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
    )
}