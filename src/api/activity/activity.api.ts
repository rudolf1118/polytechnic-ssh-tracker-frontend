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
            const res = await axiosAuth.get(`/activity/${id}`);
            if (!res || !res.data) throw new Error("Failed to get activity");
            return res?.data?.data;
        } catch(e) {
            throw e;
        }
    }
    
}

export const activityApi = new ActivityApi();