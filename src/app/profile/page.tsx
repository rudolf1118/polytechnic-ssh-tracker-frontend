"use client";
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
            className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center p-4 bg-light-bg dark:bg-dark-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Card */}
            <motion.div
              className="bg-white dark:bg-dark-secondary rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="bg-light-primary dark:bg-dark-primary p-6 text-light-foreground dark:text-dark-foreground">
                <h1 className="text-2xl font-bold">My Profile</h1>
              </div>

              {/* Profile Info */}
              <div className="p-6 divide-y divide-light-secondary dark:divide-dark-accent text-light-foreground dark:text-dark-foreground">
                {[
                  { label: "Username", value: profile?.username },
                  { label: "First Name (EN)", value: profile?.firstNameEN },
                  { label: "Last Name (EN)", value: profile?.lastNameEN },
                  { label: "First Name (AM)", value: profile?.firstNameAM },
                  { label: "Last Name (AM)", value: profile?.lastNameAM },
                  { label: "Group", value: profile?.group ? `${profile.group.split('-')[0].charAt(0).toUpperCase() + profile.group.split('-')[0].slice(1)} ${profile.group.split('-')[1]}` : '' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between py-4 text-lg">
                    <span className="font-medium text-light-accent dark:text-dark-accent">{item.label}:</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Activity Button */}
            <motion.div
              className="w-full max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => router.push('/my-activity')}
                type="button"
                className="w-full py-4 text-lg font-semibold rounded-xl bg-light-primary dark:bg-dark-primary text-white hover:bg-light-accent dark:hover:bg-dark-accent transition-all duration-300"
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