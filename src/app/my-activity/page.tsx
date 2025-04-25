'use client'

import { useEffect, useState } from "react";
import { activityApi } from "@/api/activity/activity.api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { parseDuration, getStartDate } from "@/utils/dates";
import ProtectedRoute from "@/components/Protected";
import { motion, AnimatePresence } from 'framer-motion';

export default function MyActivityPage() {
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showAllActivities, setShowAllActivities] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const res = await activityApi.getMyActivity();
                setActivity(res);
            } catch (error) {
                console.error("Failed to fetch activity:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    const handleToggleActivities = () => {
        setShowAllActivities(!showAllActivities);
    };

    return (
        <ProtectedRoute>
            <AnimatePresence>
                <motion.div
                    className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-opacity duration-700 ease-in-out"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {loading && <LoadingScreen />}
                    <motion.div
                        className="w-full max-w-4xl bg-white dark:bg-gray-900 overflow-hidden mt-5 shadow-lg rounded-lg transition-all duration-500"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-full text-gray-800 dark:text-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                                <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-sm font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">Username</div>
                                    <div className="text-lg">{activity?.username}</div>
                                </div>
                                <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-sm font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">First Name</div>
                                    <div className="text-lg">{activity?.firstName}</div>
                                </div>
                                <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-sm font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">Last Name</div>
                                    <div className="text-lg">{activity?.lastName}</div>
                                </div>
                                <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-sm font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">Duration of Activity</div>
                                    <div className="text-lg">{activity?.durationOfActivity}</div>
                                </div>
                                <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-sm font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">Last Online</div>
                                    <div className="text-lg">{activity?.lastOnline}</div>
                                </div>
                                <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-sm font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">ID</div>
                                    <div className="text-lg">{activity?.studentId}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {activity?.activities && activity.activities.length > 0 && (
                        <motion.div
                            className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="w-full text-gray-800 dark:text-white">
                                <h2 className="px-6 py-3 text-xl font-bold bg-gray-100 dark:bg-gray-800">Activity History</h2>
                                <div className="px-6 py-3 flex items-center">
                                    <span className="mr-4 text-lg font-medium uppercase tracking-wider">Sort by:</span>
                                    <motion.select 
                                        className="px-4 py-2 text-lg font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-blue-800 transition-colors duration-300 rounded border border-gray-300 dark:border-gray-700"
                                        onChange={(e) => {
                                            const sortValue = e.target.value;
                                            const sortedActivities = [...activity.activities].sort((a, b) => {
                                                if (sortValue === "date_desc") {
                                                    return Number(getStartDate(b.date)) - Number(getStartDate(a.date));
                                                }
                                                if (sortValue === "date_asc") {
                                                    return Number(getStartDate(a.date)) - Number(getStartDate(b.date));
                                                }
                                                if (sortValue === "duration_desc") return parseDuration(b.duration) - parseDuration(a.duration);
                                                if (sortValue === "duration_asc") return parseDuration(a.duration) - parseDuration(b.duration);
                                                if (sortValue === "hostname") return a.hostname.localeCompare(b.hostname);
                                                if (sortValue === "ip") return a.ip.localeCompare(b.ip);
                                                return 0;
                                            });
                                            setActivity({ ...activity, activities: sortedActivities });
                                        }}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        whileFocus={{ scale: 1.05 }}
                                    >
                                        <option value="date_desc">Date (Newest First)</option>
                                        <option value="date_asc">Date (Oldest First)</option>
                                        <option value="duration_desc">Duration (Longest First)</option>
                                        <option value="duration_asc">Duration (Shortest First)</option>
                                        <option value="hostname">Hostname</option>
                                        <option value="ip">IP Address</option>
                                    </motion.select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                    {(showAllActivities ? activity.activities : activity.activities.slice(0, 2)).map((item: any, index: number) => (
                                        <motion.div 
                                            key={item._id || index} 
                                            className="flex flex-col p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <div className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">IP:</div>
                                                <div className="text-gray-800 dark:text-white">{item.ip}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <div className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Hostname:</div>
                                                <div className="text-gray-800 dark:text-white">{item.hostname}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <div className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date:</div>
                                                <div className="text-gray-800 dark:text-white">{item.date}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Duration:</div>
                                                <div className="text-gray-800 dark:text-white">{item.duration}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    
                    {activity?.activities && activity.activities.length > 2 && (
                        <motion.div
                            className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden mt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <button 
                                onClick={handleToggleActivities} 
                                className="w-full py-4 text-lg font-medium uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
                            >
                                <span>
                                    {showAllActivities ? "Show Less" : "Show All Activities"}
                                </span>
                                <svg 
                                    className={`ml-2 w-5 h-5 transition-transform duration-500 ${showAllActivities ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </ProtectedRoute>
    )
}