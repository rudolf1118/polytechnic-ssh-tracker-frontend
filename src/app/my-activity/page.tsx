'use client';

import { useEffect, useState } from "react";
import { studentApi } from "@/api/student/student.api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/Protected";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const res = await studentApi.getMyProfile();
      setProfile(res);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  return (
    <ProtectedRoute>
      <AnimatePresence>
        {loading && <LoadingScreen />}
        {!loading && (
          <motion.div
            className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden p-6 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
                My Profile
              </h1>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Username", value: profile?.username },
                  { label: "First Name (EN)", value: profile?.firstNameEN },
                  { label: "Last Name (EN)", value: profile?.lastNameEN },
                  { label: "First Name (AM)", value: profile?.firstNameAM },
                  { label: "Last Name (AM)", value: profile?.lastNameAM },
                  { label: "Group", value: profile?.group ? `${profile.group.split('-')[0].toUpperCase()} ${profile.group.split('-')[1]}` : '' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="text-sm font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                      {item.label}
                    </div>
                    <div className="text-lg text-gray-800 dark:text-white break-words">
                      {item.value || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Button */}
            <motion.div
              className="w-full max-w-4xl mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => router.push('/my-activity')}
                className="w-full py-4 text-lg font-medium uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300"
              >
                View Your Activity History
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}