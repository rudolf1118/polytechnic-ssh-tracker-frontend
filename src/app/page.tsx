'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { activityApi } from '@/api/activity/activity.api';
import StudentsActivity from '@/components/StudentsActivity';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityItem {
  ip: string;
  hostname: string;
  date: string;
  duration: string;
  description: string;
  _id: string;
  createdAt: string;
  modifyAt: string;
}

export default function Home() {
  const { isAuthenticated, role } = useAuth();
  const [activitySummary, setActivitySummary] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [syncedData, setSyncedData] = useState<any>();
  const fetchActivitySummary = async () => {
    try {
      setLoading(true);
      setSyncing(true);
      const res = await activityApi.getMyActivity();
      if (res?.activities) {
        setActivitySummary(res.activities);
        setFetched(true);
      }
    } catch (error) {
      console.error("Failed to fetch activity:", error);
      setFetched(false);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  const syncUsersActivity = async () => {
    try {
      setLoading(true);
      const res = await activityApi.syncUsersActivity();
      if (res) {
        setSyncedData(res);
        setSynced(true);
      }
    } catch (error) {
      console.error("Failed to sync users activity:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated && !fetched) {
      fetchActivitySummary();
    }
  }, [isAuthenticated]);

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 light-black:from-gray-800 light-black:to-gray-700 transition-opacity duration-700 ease-in-out"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white light-black:text-gray-200">Welcome to SSH Activity Tracker</h1>
          <p className="mt-4 text-lg text-center text-gray-600 dark:text-gray-300 light-black:text-gray-400">
            This app helps you track your activity on the SSH server.
          </p>

          {isAuthenticated && (
            <div className="mt-6 w-full flex flex-col items-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={role === 'admin' ? syncUsersActivity : fetchActivitySummary}
                disabled={loading}
              >
                {loading ? (
                  'Loading...'
                ) : role === 'admin' ? (
                  syncing ? 'Syncing...' : 'Click to Sync Users Activity'
                ) : (
                  'Click to Fetch Your Activity Summary'
                )}
              </button>
              {synced && (
                <p className="mt-4 text-sm text-green-600 dark:text-green-400">
                  {syncedData?.message && (
                    <span className="block">{syncedData.message}</span>
                  )}
                  {syncedData?.deepMessage && (
                    <span className="block">{syncedData.deepMessage}</span>
                  )}
                </p>
              )}

              {role === 'admin' && (
                <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300">Admin Panel</h2>
                  <p className="text-yellow-700 dark:text-yellow-400">You have access to admin functionalities.</p>
                </div>
              )}

              <AnimatePresence>
                {!loading && fetched && (
                  activitySummary.length > 0 ? (
                    <motion.div
                      className="mt-8 w-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <StudentsActivity data={activitySummary} />
                    </motion.div>
                  ) : (
                    <motion.p
                      className="mt-6 text-gray-500 dark:text-gray-400 light-black:text-gray-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      No activity data found.
                    </motion.p>
                  )
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="w-full p-4 text-center text-sm text-gray-500 dark:text-gray-400 light-black:text-gray-300 border-t border-gray-200 dark:border-gray-700 light-black:border-gray-600 transition-opacity duration-700 ease-in-out">
        <p>Made by Rudolf Harutyunyan</p>
        <p className="mt-2">© 2025 SSH Activity Tracker</p>
      </footer>
    </>
  );
}