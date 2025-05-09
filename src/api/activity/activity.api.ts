import { axiosAuth } from "../config/axios";

export class ActivityApi {

    constructor() {}

    async getMyActivity(): Promise<any> {
        try {
            const res = await axiosAuth.get("/activity/me");
            if (!res || !res.data) throw new Error("Failed to get activity");
            return res?.data?.data[0];
        } catch(e) {
            throw e;
        }
    }

    async getActivityById(id: string): Promise<any> {
        try {
            const res = await axiosAuth.get(`/activity/search?studentId=${id}`);
            if (!res || !res.data) throw new Error("Failed to get activity");
            return res?.data?.data[0];
        } catch(e) {
            throw e;
        }
    }

    async getTopParticipants(limit: number = 10, group: string = "all"): Promise<any> {
        try {
            const res = await axiosAuth.get(`/activity/getTopParticipants?limit=${limit}&group=${group || "all"}`);
            if (!res || !res.data) throw new Error("Failed to get top participants");
            return res?.data?.data;
        } catch(e) {
            throw e;
        }
    }

    async syncUsersActivity(): Promise<any> {
        try {
            const res = await axiosAuth.get("/activity/syncUsersActivity");
            if (!res || !res.data) throw new Error("Failed to sync users activity");
            const { message } = res.data;
            const {message: deepMessage} = res.data.data;
            return {
                message,
                deepMessage
            };
        } catch(e) {
            throw e;
        }
    }
    
}

export const activityApi = new ActivityApi();