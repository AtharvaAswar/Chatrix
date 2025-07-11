import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },
    sendMessages: async (messageData) => {
        try {
            const { messages, selectedUser } = get();
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (e) {
            toast.error(e.response.data.message);
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMsgFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMsgFromSelectedUser) return;
            set({ messages: [...get().messages, newMessage] })
        });
    },
    unSubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => {
        set({ selectedUser: selectedUser });
    }
}));