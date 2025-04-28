// import { SignupParams, LoginParams, AuthResponse, IAuthApi } from "@/api/interfaces";
import { axiosAuth, axiosNoAuth  } from "../config/axios";

export class AuthApi {

    constructor() {}

    async signup(params: any): Promise<any> {
        try {
            const res = await axiosNoAuth.post("/auth/signup", params);
            if (!res || !res.data) throw new Error("Failed to signup");
            return res?.data;
        } catch(e) {
            throw e;
        }
    }

    async login(params: any): Promise<any> {
        try {
            const res = await axiosNoAuth.post("/auth/login", params);
            
            if (!res || !res.data) throw new Error("Failed to login");
            if (res.data.data.token) {
                localStorage.setItem("token", res.data.data.token);
                return res.data;
            }
            throw new Error("Password or Username is incorrect");
        } catch(e) {
            throw e;
        }
    }

    async verifyToken(): Promise<{verified: boolean, role: string | null}> {
        try {
            const token = localStorage.getItem("token");
            if (!token) return {verified: false, role: null};    
            const res = await axiosAuth.get("/auth/verify");
            if (!res || !res.data) throw new Error("Failed to verify token");
            if (res.data.data.verified && !res.data.data.role) res.data.data.role = 'user';
            return res.data.data;
        } catch(e) {
            return { verified: false, role: null };
        }
    }

    async verifyConnection(): Promise<any> {
        try {
            const res = await axiosAuth.get("/auth/connect");
            if (res && res.status === 200) {
                await axiosAuth.get("/auth/disconnect");
                return true;
            }
            return false;
        } catch(e) {
            throw e;
        }
    }

    async executeCommand(command: string): Promise<any> {
        try {
            const res = await axiosAuth.post("/auth/execute", { command });
            const {message} = res.data;
            const {stdout, stderr} = res.data?.data;
            if (stdout || stderr) return {
                stdout,
                message,
                stderr
            }
            return {
                message,
                stdout,
                stderr
            }
        } catch(e) {
            throw e;
        }
    }

    async connectConnection(): Promise<any> {
        try {
            const res = await axiosAuth.get("/auth/connect");
            if (!res || !res.data) throw new Error("Failed to disconnect connection");
            return res.data.data;
        } catch(e) {
            throw e;
        }
    }
    
    async logout() {
        localStorage.removeItem("token");
    }
}

export const authApi = new AuthApi();