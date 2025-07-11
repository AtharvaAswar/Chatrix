import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const BASEURL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    socket: null,
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
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
            get().connectSocket();
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
            get().connectSocket();
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
            get().disconnectSocket();
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
    },

    connectSocket: () => {
        console.log("fnc called");
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASEURL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
    },
    disconnectSocket: () => {
        console.log("fnc called");
        if (get().socket?.connected) get().socket.disconnect();
    }
}));