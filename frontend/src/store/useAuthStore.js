import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'sonner'
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.VITE_BACKEND_URL2

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({ authUser: res.data })
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth", error.message)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {
            console.log("Error in signup authStore", error.message)
        } finally {
            set({ isSigningUp: false })
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({ authUser: null })
            toast.success("Logout successfull")
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.res.data.message)
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post('auth/login', data)
            set({ authUser: res.data })
            toast.success("Logged in successfully.")
            get().connectSocket()
        } catch (error) {
            console.log("Error in login authStore", error.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('auth/update-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            set({ authUser: res.data });
            toast.success("Profile updated successfully.");
        } catch (error) {
            console.error("Error in update profile:", error);
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return
        const socket = io(BASE_URL, {
            query : {
                userId : authUser._id
            },
            withCredentials : true
        })
        socket.connect()
        set({socket : socket})

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect()
    }
}))