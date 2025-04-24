'use client';
import { activityApi } from "@/api/activity/activity.api";
import TopStudentsChart from "@/components/TopStudentsChart";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/Protected";

export default function TopStudentsPage() {
    const [topParticipants, setTopParticipants] = useState<any[]>([]);
    const [limit, setLimit] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await activityApi.getTopParticipants(limit);
                setTopParticipants(res);
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [limit]);

    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center min-h-screen p-4 w-full mt-5">
               <div className="w-full md:w-3/4 lg:w-1/2 max-w-6xl p-4 rounded-lg bg-gray-900 text-white border border-gray-700 shadow-md hover:shadow-blue-900/20 transition-all duration-300 mb-8">
                 <h3 className="text-xl md:text-2xl font-semibold text-blue-400 mb-3 text-center">Score Calculation Formula</h3>
                 <div className="flex flex-col gap-2 p-3 md:p-5 justify-center items-center bg-gray-800 rounded border-l-4 border-blue-500">
                   <p className="mb-2 text-gray-300 text-center text-sm md:text-base">The student score is calculated using:</p>
                   <div className="font-mono bg-gray-950 p-3 md:p-4 rounded-md text-blue-300 font-bold text-center text-xs sm:text-sm md:text-base w-full overflow-x-auto">
                     (Total Duration in Minutes) × 3 + (Total Sessions) × 2 + (Unique IPs) × 3
                   </div>
                 </div>
               </div>
               
               <div className="w-full flex justify-center mb-5">
                  <select 
                    name="limit" 
                    id="limit" 
                    className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 p-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-blue-900 transition-all duration-300 focus:outline-none" 
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value));
                    }}
                    disabled={loading}
                    value={limit}
                  >
                    <option value="3">Top 3 Students</option>
                    <option value="5">Top 5 Students</option>
                    <option value="10">Top 10 Students</option>
                    <option value="20">Top 20 Students</option>
                    <option value="30">Top 30 Students</option>
                    <option value="65">All Students</option>
                  </select>
               </div>
               
                {loading ? (
                  <div className="w-full h-96 flex justify-center items-center">
                    <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <TopStudentsChart data={topParticipants} />
                  </div>
                )}
            </div>
        </ProtectedRoute>
    )
}