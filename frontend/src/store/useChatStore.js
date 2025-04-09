import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get('/message/users');
      set({ users: res.data });
    } catch (error) {
      console.log("error in getUsers(messages)", error.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("error in getMessages(messages)", error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();
    const formData = new FormData();

    formData.append('text', messageData.text);
    if (messageData.image) {
      const res = await fetch(messageData.image);
      const blob = await res.blob();
      formData.append('image', blob, 'image.jpg');
    }

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      set({ messages: [...(messages || []), res.data] });
    } catch (error) {
      console.log("error in sendMessages", error.response?.data || error.message);
    }
  },

  listenToMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;

    if (!socket || !selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      const activeUser = get().selectedUser;
      const isFromCurrentChat = newMessage.senderId === activeUser._id;

      if (isFromCurrentChat) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
      }
    });
  },

  dontListenToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off('newMessage');
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
