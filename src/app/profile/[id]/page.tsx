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
                        className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] w-full max-w-6xl mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Card Header */}
                            <div className="bg-blue-900 px-6 py-4 text-white">
                                <h3 className="text-xl font-bold">Student Profile</h3>
                            </div>
                            
                            {/* Card Content */}
                            <div className="p-6 text-white">
                                <div className="flex flex-col divide-y divide-gray-700">
                                    <div className="flex justify-between py-3 border-b border-gray-700">
                                        <span className="text-gray-400">Username:</span>
                                        <span className="font-medium">{profile?.username}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3 border-b border-gray-700">
                                        <span className="text-gray-400">Name (EN):</span>
                                        <span className="font-medium">{profile?.firstNameEN}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3 border-b border-gray-700">
                                        <span className="text-gray-400">Last Name (EN):</span>
                                        <span className="font-medium">{profile?.lastNameEN}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3 border-b border-gray-700">
                                        <span className="text-gray-400">Name (AM):</span>
                                        <span className="font-medium">{profile?.firstNameAM}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3 border-b border-gray-700">
                                        <span className="text-gray-400">Last Name (AM):</span>
                                        <span className="font-medium">{profile?.lastNameAM}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-3">
                                        <span className="text-gray-400">Group:</span>
                                        <span className="font-medium">{profile?.group ? (profile.group.split('-')[0].charAt(0).toUpperCase() + profile.group.split('-')[0].slice(1) + ' ' + profile.group.split('-')[1]) : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            className="w-full max-w-6xl bg-black rounded-lg shadow-2xl overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <button 
                                onClick={() => router.push(`/activities/${id}`)}
                                type="button"
                                className="w-full py-4 text-lg font-medium uppercase tracking-wider bg-blue-900 text-white hover:bg-blue-800 transition-colors duration-300 cursor-pointer">
                                View Activity History
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ProtectedRoute>
    )
}