'use client';

import { activityApi } from "@/api/activity/activity.api";
import TopStudentsChart from "@/components/TopStudentsChart";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/Protected";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from 'react-responsive';

export default function TopStudentsPage() {
  const [topParticipants, setTopParticipants] = useState<any[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedLab, setSelectedLab] = useState<string>("");
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await activityApi.getTopParticipants(limit, selectedLab);
        setTopParticipants(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit, selectedLab]);

  const handleBarClick = (data: any) => {
    if (isMobile) {
      setSelectedStudent(data);
    } else {
      fetchStudentData(data.studentId);
    }
  };

  const fetchStudentData = async (studentId: string) => {
    try {
      setLoading(true);
      // Fetch detailed data for the student
      const res = await activityApi.getActivityById(studentId);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <AnimatePresence>
        <motion.div
          className="flex flex-col items-center min-h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Formula Card */}
          <motion.div
            className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">
              Score Calculation Formula
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                The student score is calculated using:
              </p>
              <div className="font-mono bg-gray-200 dark:bg-gray-700 p-2 rounded text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                (Total Duration Minutes) × 3 + (Total Sessions) × 2 + (Unique IPs) × 3
              </div>
            </div>
          </motion.div>

          {/* Limit Select */}
          <motion.div
            className="w-full max-w-4xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <select
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              disabled={loading}
            >
              <option value="3">Top 3 Students</option>
              <option value="5">Top 5 Students</option>
              <option value="10">Top 10 Students</option>
              <option value="20">Top 20 Students</option>
              <option value="30">Top 30 Students</option>
              <option value="65">All Students</option>
            </select>
            <select
              className="mt-2 w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              disabled={loading}
            >
              <option value="all">All Labs</option>
              <option value="lab-1">Lab 1</option>
              <option value="lab-2">Lab 2</option>
              <option value="lab-3">Lab 3</option>
              <option value="lab-4">Lab 4</option>
            </select>
          </motion.div>

          {/* Chart or Loader */}
          <motion.div
            className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-80">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <TopStudentsChart data={topParticipants} onBarClick={handleBarClick} />
            )}
          </motion.div>

          {/* Mobile Info Modal */}
          {isMobile && selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-2">{selectedStudent.fullName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">@{selectedStudent.username}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => fetchStudentData(selectedStudent.studentId)}
                >
                  View Details
                </button>
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                  onClick={() => setSelectedStudent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </ProtectedRoute>
  );
}
