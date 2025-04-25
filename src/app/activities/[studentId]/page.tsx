'use client'

import { useEffect, useState } from "react";
import { activityApi } from "@/api/activity/activity.api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { parseDuration, getStartDate } from "@/utils/dates";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/Protected";

export default function ActivityPage() {
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showAllActivities, setShowAllActivities] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);
    const { studentId } = useParams();
    
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const res = await activityApi.getActivityById(studentId as string);
                setActivity(res);
            } catch (error) {
                console.error("Failed to fetch activity:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [studentId]);

    const handleToggleActivities = () => {
        setAnimating(true);
        setTimeout(() => {
            setShowAllActivities(!showAllActivities);
            setAnimating(false);
        }, 200);
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                {loading && <LoadingScreen/>}
            <div className="w-full max-w-6xl bg-black overflow-hidden mt-5 shadow-inner rounded-lg transition-all duration-500 transform hover:scale-[1.01]">
                <div className="w-full text-white">
                    <div className="flex flex-col divide-y divide-gray-800 bg-gradient-to-r">
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900 ">Username</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{activity?.username}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">First Name</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{activity?.firstName}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">Last Name</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{activity?.lastName}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">Duration of Activity</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{activity?.durationOfActivity}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">Last Online</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{activity?.lastOnline}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">ID</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{activity?.studentId}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            {activity?.activities && activity.activities.length > 0 && (
                <div className="w-full max-w-6xl bg-black rounded-lg shadow-2xl overflow-hidden mt-6">
                    <div className="w-full text-white">
                        <h2 className="px-8 py-4 text-xl font-bold bg-gray-900">Activity History</h2>
                        <div className="px-8 py-4 flex items-center">
                            <span className="mr-4 text-lg font-medium uppercase tracking-wider text-white">Sort by:</span>
                            <select 
                                className="px-4 py-2 text-lg font-medium bg-gray-900 text-white hover:bg-blue-800 transition-colors duration-300 rounded border border-gray-700 md:mr-3 sm:mr-3"
                                onChange={(e) => {
                                    const sortValue = e.target.value;
                                    setAnimating(true);
                                    setTimeout(() => {
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
                                        setAnimating(false);
                                    }, 300);
                                }}
                            >
                                <option value="date_desc">Date (Newest First)</option>
                                <option value="date_asc">Date (Oldest First)</option>
                                <option value="duration_desc">Duration (Longest First)</option>
                                <option value="duration_asc">Duration (Shortest First)</option>
                                <option value="hostname">Hostname</option>
                                <option value="ip">IP Address</option>
                            </select>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 transition-all duration-500 ${animating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                            {(showAllActivities ? activity.activities : activity.activities.slice(0, 2)).map((item: any, index: number) => (
                                <div 
                                    key={item._id || index} 
                                    className={`flex flex-col p-4 border border-gray-800 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300 ${showAllActivities || animating ? 'animate-fadeIn' : ''}`}
                                    style={{animationDelay: `${index * 100}ms`}}
                                >
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div className="text-sm font-medium uppercase tracking-wider text-gray-400">IP:</div>
                                        <div className="text-white">{item.ip}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div className="text-sm font-medium uppercase tracking-wider text-gray-400">Hostname:</div>
                                        <div className="text-white">{item.hostname}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div className="text-sm font-medium uppercase tracking-wider text-gray-400">Date:</div>
                                        <div className="text-white">{item.date}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="text-sm font-medium uppercase tracking-wider text-gray-400">Duration:</div>
                                        <div className="text-white">{item.duration}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {activity?.activities && activity.activities.length > 2 && (
                <div className="w-full max-w-6xl bg-black rounded-lg shadow-2xl overflow-hidden mt-6 transform transition-all duration-500 hover:scale-[1.01]">
                    <button 
                        onClick={handleToggleActivities} 
                        className={`w-full py-4 text-lg font-medium uppercase tracking-wider bg-blue-900 text-white hover:bg-blue-800 transition-all duration-300 flex items-center justify-center group ${animating ? 'animate-pulse' : ''}`}
                        disabled={animating}
                    >
                        <span className="transform transition-transform duration-300 group-hover:translate-y-[-2px]">
                            {showAllActivities ? "Show Less" : "Show All Activities"}
                        </span>
                        <svg 
                            className={`ml-2 w-5 h-5 transition-transform duration-500 ${showAllActivities ? 'rotate-180' : ''} ${animating ? 'animate-spin' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
        </ProtectedRoute>
    )
}