/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SpinnerScreen from "../ui/spinner/spinner-screen";

export default function GlobalLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 300); // minimum 300ms
      setPrevPath(pathname);
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPath]);

  if (!loading) return null;
  return <SpinnerScreen />;
}