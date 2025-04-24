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

    async verifyToken(): Promise<boolean> {
        try {
            console.log("verifying token");
            const token = localStorage.getItem("token");
            console.log(token);
            if (!token) return false;    
            const res = await axiosAuth.get("/auth/verify");
            console.log(res);
            if (!res || !res.data) throw new Error("Failed to verify token");
            console.log(res.data);
            if(res.data.data.verified) return true;
            console.log("token is not verified");
            return false;
        } catch(e) {
            console.log("error in verify token");
            return false;
        }
    }
    
    async logout() {
        localStorage.removeItem("token");
    }
}

export const authApi = new AuthApi();