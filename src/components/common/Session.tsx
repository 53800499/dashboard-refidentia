// src/components/session/Session.tsx
"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import SpinnerScreen from "../ui/spinner/spinner-screen";
import { GUEST, REGISTERED, SessionStatusTypes } from "@/lib/session-status";

interface Props {
  children: React.ReactNode;
  sessionStatus?: SessionStatusTypes;
}

export default function Session({ children, sessionStatus }: Props) {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuthStore();

  // On charge l'utilisateur au montage
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Gestion des redirections
  useEffect(() => {
    if (!loading) {
      if (sessionStatus === GUEST && user) {
        router.replace("/profil");
      } else if (sessionStatus === REGISTERED && !user) {
        router.replace("/connexion");
      }
    }
  }, [loading, user, sessionStatus, router]);

  // Spinner tant que l'utilisateur n'est pas chargé
  if (loading) return <SpinnerScreen />;

  // Si la redirection n'est pas nécessaire, on affiche le contenu
  return <>{children}</>;
}