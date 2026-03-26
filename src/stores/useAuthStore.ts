// src/stores/useAuthStore.ts
"use client";

import {create} from "zustand";
import Cookies from "js-cookie";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  // Champs optionnels renvoyés par ton backend `/me`
  // permettant de déterminer l'entreprise courante (tenant).
  companyId?: number | string;
  shopId?: number | string;
  traderId?: number | string;
  organizationId?: number | string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    set({ loading: true });
    const token = Cookies.get("_token_web");
    if (!token) {
      set({ user: null, loading: false });
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const res = await axios.get("/me"); 
      set({ user: res.data, loading: false });
    } catch {
      Cookies.remove("_token_web");
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    const res = await axios.post("/login", { email, password });
    const token = res.data.token;
    Cookies.set("_token_web", token, { expires: 1, secure: true, sameSite: "strict" });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await useAuthStore.getState().fetchUser();
  },

  logout: () => {
    Cookies.remove("_token_web");
    set({ user: null });
    delete axios.defaults.headers.common["Authorization"];
  },
}));