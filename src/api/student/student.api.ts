import { axiosAuth } from "../config/axios";

export class StudentApi {

    constructor() {}

    async getMyProfile(): Promise<any> {
        try {
            const res = await axiosAuth.get("/student/me");
            if (!res || !res.data) throw new Error("Failed to get student");
            return res?.data?.data;
        } catch(e) {
            throw e;
        }
    }

    async getStudentById(id: string): Promise<any> {
        try {
            const res = await axiosAuth.get(`/student/search?id=${id}`);
            if (!res || !res.data) throw new Error("Failed to get student");
            return res?.data?.data;
        } catch(e) {
            throw e;
        }
    }

    async getStudentsByGroup(group:string = ""): Promise<any> {
        try {
            let paramGroup = group || (await this.getMyProfile()).group;
            const res = await axiosAuth.get(`/student/search`, {params: {group: paramGroup}});
            if (!res || !res.data) throw new Error("Failed to get students");
            return res?.data?.data;
        } catch(e) {
            throw e;
        }
    }
}

export const studentApi = new StudentApi();