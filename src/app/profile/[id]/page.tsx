"use client";
import { useEffect, useState } from "react";
import { studentApi } from "@/api/student/student.api";
import LoadingScreen from "@/components/common/LoadingScreen";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/Protected";

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
        <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center p-4">  
          {loading && <LoadingScreen/>}
            <div className="w-full max-w-6xl bg-black rounded-lg shadow-2xl overflow-hidden">
                <div className="w-full text-white">
                    <div className="flex flex-col divide-y divide-gray-800">
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">Username</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{profile?.username}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">Name (EN)</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{profile?.firstNameEN}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">Last Name (EN)</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{profile?.lastNameEN}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">Name (AM)</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{profile?.firstNameAM}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">Last Name (AM)</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{profile?.lastNameAM}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="px-8 py-4 text-left text-sm font-medium uppercase tracking-wider w-full sm:w-1/6 bg-gray-900">Group</div>
                            <div className="px-8 py-4 whitespace-nowrap w-full sm:w-2/3 text-lg">{profile?.group ? (profile.group.split('-')[0].charAt(0).toUpperCase() + profile.group.split('-')[0].slice(1) + ' ' + profile.group.split('-')[1]) : ''}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-6xl bg-black rounded-lg shadow-2xl overflow-hidden mt-6">
                <button 
                    onClick={() => router.push(`/activities/${id}`)}
                    type="button"
                className="w-full py-4 text-lg font-medium uppercase tracking-wider bg-blue-900 text-white hover:bg-blue-800 transition-colors duration-300 cursor-pointer">
                    View Your Activity History
                </button>
            </div>
        </div>
        </ProtectedRoute>
    )
}