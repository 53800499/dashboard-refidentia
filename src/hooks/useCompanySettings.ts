"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApiService } from "./useApiService";
import { useAuthStore } from "@/stores/useAuthStore";

export interface CompanySettings {
  companyName: string;
  ifu: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  // Stocke soit un URL (backend), soit un dataURL (fallback local).
  logo: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: "",
  ifu: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  logo: "",
};

const STORAGE_KEY_PREFIX = "companySettings:";
const API_RESOURCE_URL = "company-settings";

function safeGetEnterpriseId(user: unknown) {
  const u = user as any;
  const raw = u?.companyId ?? u?.shopId ?? u?.traderId ?? u?.organizationId ?? u?.id;
  if (raw === undefined || raw === null) return "default";
  return String(raw);
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier"));
    reader.readAsDataURL(file);
  });
}

export function useCompanySettings() {
  const { user, fetchUser } = useAuthStore();
  const enterpriseId = useMemo(() => safeGetEnterpriseId(user), [user]);

  const {
    fetchById,
    update,
    create,
    loading: apiLoading,
    error: apiError,
  } = useApiService<CompanySettings>();

  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = useMemo(() => `${STORAGE_KEY_PREFIX}${enterpriseId}`, [enterpriseId]);

  // Les fonctions retournées par `useApiService`/`zustand` ne sont pas garanties stables.
  // On les stocke dans des refs pour éviter de relancer les effets à chaque render.
  const fetchByIdRef = useRef(fetchById);
  useEffect(() => {
    fetchByIdRef.current = fetchById;
  }, [fetchById]);

  const fetchUserRef = useRef(fetchUser);
  useEffect(() => {
    fetchUserRef.current = fetchUser;
  }, [fetchUser]);

  // On charge l'utilisateur pour déterminer le tenant/entreprise courant.
  useEffect(() => {
    fetchUserRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      // 1) fallback local (immédiat)
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<CompanySettings>;
          if (!cancelled) setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch {
        // ignore
      }

      // 2) tentative backend
      try {
        const res = await fetchByIdRef.current(API_RESOURCE_URL, enterpriseId);
        if (!cancelled && res) {
          setSettings({ ...DEFAULT_SETTINGS, ...(res as CompanySettings) });
        }
      } catch {
        // ignore backend (fallback local)
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [enterpriseId, storageKey]);

  const saveSettings = useCallback(
    async (next: CompanySettings) => {
      setLoading(true);
      setError(null);

      // 1) persistance locale
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e: any) {
        // Si localStorage n'est pas dispo, on continue quand même (backend éventuel).
        setError(e?.message ? String(e.message) : "Erreur stockage local");
      }

      // 2) tentative backend
      try {
        const candidate = { ...next, enterpriseId };
        // Update en priorité (si le record existe)
        await update(API_RESOURCE_URL, enterpriseId, candidate);
      } catch (err: any) {
        // S'il n'existe pas côté backend, on tente une création.
        try {
          await create(API_RESOURCE_URL, { ...next, enterpriseId });
        } catch (createErr: any) {
          setError(createErr?.message ? String(createErr.message) : "Erreur API sauvegarde");
        }
      } finally {
        setLoading(false);
      }

      setSettings(next);
    },
    [create, enterpriseId, storageKey, update]
  );

  const onLogoFileSelected = useCallback(
    async (file: File | null) => {
      if (!file) return;
      const dataUrl = await readFileAsDataUrl(file);
      await saveSettings({ ...settings, logo: dataUrl });
    },
    [saveSettings, settings]
  );

  return {
    settings,
    loading: loading || apiLoading,
    error: error || apiError,
    enterpriseId,
    saveSettings,
    onLogoFileSelected,
    reload: () => {
      setSettings(DEFAULT_SETTINGS);
    },
  };
}

