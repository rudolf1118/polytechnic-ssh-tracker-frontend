'use client';

import { useEffect, useState } from "react";
import { authApi } from "@/api/auth/auth.api";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/Protected";
import { motion, AnimatePresence } from "framer-motion";

export default function SSHConnectionPage() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [command, setCommand] = useState<string>("");
  const [commandOutput, setCommandOutput] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [commandError, setCommandError] = useState<string>("");
  const router = useRouter();

  const verifyConnection = async () => {
    try {
      const res = await authApi.verifyConnection();
      setVerified(res);
    } catch (error) {
      console.error(error);
      setVerified(false);
    }
  }
  const connectSSH = async () => {
    try {
      setLoading(true);
      setConnecting(true);
      await authApi.connectConnection();
      setConnected(true);
      setConnecting(false);
    } catch (error) {
      console.error(error);
      setConnected(false);
      setConnecting(false);
    } finally {
      setLoading(false);
    }
  };

  const disconnectSSH = async () => {
    try {
      setLoading(true);
    //   await authApi.disconnectConnection();
      setConnected(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const executeCommand = async () => {
    if (!command.trim()) return;
    try {
      setLoading(true);
      const res = await authApi.executeCommand(command);
      setCommandOutput(res.stdout || "No output");
      setCommandError(res.stderr || "");
    } catch (error) {
      console.error(error);
      setCommandOutput("Failed to execute command.");
      setCommandError(error instanceof Error ? error.message : "Failed to execute command.");
    } finally {
      setLoading(false);
      setCommand("");
    }
  };

  useEffect(() => {
    const verify = async () => {
      setVerifying(true);
      await verifyConnection();
      setVerifying(false);
    }
    verify();
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
            {/* Connection Status Card */}
            <motion.div
              className="bg-white dark:bg-dark-secondary rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="bg-light-primary dark:bg-dark-primary p-6 text-light-foreground dark:text-dark-foreground">
                <h1 className="text-2xl font-bold">SSH Connection</h1>
              </div>

              {/* Connection Info */}
              <div className="p-6 flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-lg">Status:</span>
                  {connecting ? (
                    <span className="text-gray-500 font-semibold">Connecting...</span>
                  ) : connected ? (
                    <span className="text-green-500 font-semibold">Connected</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Disconnected</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-lg">Verified:</span>
                  {verifying ? (
                    <span className="text-gray-500 font-semibold">Verifying...</span>
                  ) : verified ? (
                    <span className="text-green-500 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-500 font-semibold">No</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={connectSSH}
                    className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-300"
                    disabled={!!connected}
                  >
                    {connected === null ? "Connect SSH" : "Reconnect SSH"}
                  </button>
                  <button
                    onClick={disconnectSSH}
                    className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300"
                    disabled={connected === null || !connected}
                  >
                    Disconnect SSH
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Execute Command Card */}
            {connected && (
              <motion.div
                className="bg-white dark:bg-dark-secondary rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-light-primary dark:bg-dark-primary p-6 text-light-foreground dark:text-dark-foreground">
                  <h2 className="text-xl font-bold">Execute SSH Command</h2>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command"
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-dark-bg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <button
                    onClick={executeCommand}
                    className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300"
                  >
                    Execute
                  </button>
                  {commandOutput && (
                    <div className="mt-4 p-4 bg-gray-200 dark:bg-dark-bg rounded-lg text-sm overflow-x-auto">
                      <pre>{commandOutput}</pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}