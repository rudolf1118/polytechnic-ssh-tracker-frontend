"use client";
import { useEffect, useState } from "react";
import { studentApi } from "@/api/student/student.api";
import LoadingScreen from "@/components/common/LoadingScreen";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/Protected";
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePageByID() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const res = await studentApi.getStudentById(id as string);
            console.log(res);
            setProfile(res);
            setLoading(false);
        };
        fetchProfile();
    }, [id]);

    return (
        <ProtectedRoute>
            <AnimatePresence>
                {loading && <LoadingScreen />}
                {!loading && (
                    <motion.div
                        className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 light-black:from-gray-800 light-black:to-gray-700 transition-opacity duration-700 ease-in-out"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="bg-gray-900 dark:bg-gray-800 light-black:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] w-full max-w-6xl mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Card Header */}
                            <div className="bg-blue-900 dark:bg-blue-800 light-black:bg-blue-700 px-6 py-4 text-white">
                                <h3 className="text-xl font-bold">Student Profile</h3>
                            </div>
                            
                            {/* Card Content */}
                            <div className="p-6 text-white">
                                <div className="flex flex-col divide-y divide-gray-700 dark:divide-gray-600 light-black:divide-gray-500">
                                    <div className="flex justify-between py-3 border-b border-gray-700 dark:border-gray-600 light-black:border-gray-500">
                                        <span className="text-gray-400 dark:text-gray-300 light-black:text-gray-200">Username:</span>
                                        <span className="font-medium">{profile?.username}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3 border-b border-gray-700 dark:border-gray-600 light-black:border-gray-500">
                                        <span className="text-gray-400 dark:text-gray-300 light-black:text-gray-200">Name (EN):</span>
                                        <span className="font-medium">{profile?.firstNameEN}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3 border-b border-gray-700 dark:border-gray-600 light-black:border-gray-500">
                                        <span className="text-gray-400 dark:text-gray-300 light-black:text-gray-200">Last Name (EN):</span>
                                        <span className="font-medium">{profile?.lastNameEN}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3 border-b border-gray-700 dark:border-gray-600 light-black:border-gray-500">
                                        <span className="text-gray-400 dark:text-gray-300 light-black:text-gray-200">Name (AM):</span>
                                        <span className="font-medium">{profile?.firstNameAM}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3 border-b border-gray-700 dark:border-gray-600 light-black:border-gray-500">
                                        <span className="text-gray-400 dark:text-gray-300 light-black:text-gray-200">Last Name (AM):</span>
                                        <span className="font-medium">{profile?.lastNameAM}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3">
                                        <span className="text-gray-400 dark:text-gray-300 light-black:text-gray-200">Group:</span>
                                        <span className="font-medium">{profile?.group ? (profile.group.split('-')[0].charAt(0).toUpperCase() + profile.group.split('-')[0].slice(1) + ' ' + profile.group.split('-')[1]) : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            className="w-full max-w-6xl bg-black dark:bg-gray-900 light-black:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <button 
                                onClick={() => router.push(`/activities/${id}`)}
                                type="button"
                                className="w-full py-4 text-lg font-medium uppercase tracking-wider bg-blue-900 dark:bg-blue-800 light-black:bg-blue-700 text-white hover:bg-blue-800 dark:hover:bg-blue-700 light-black:hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                                View Activity History
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ProtectedRoute>
    )
}