import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (e) {
            console.log("CheckAuth Error: ", e.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (e) {
            toast.error(e.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Loggedin successfully");
        } catch (e) {
            toast.error(e.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        try {
            axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully!");
        } catch (e) {
            console.log(e.message);
            toast.error(e.message);
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Pofile image updated successfully");
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
}));