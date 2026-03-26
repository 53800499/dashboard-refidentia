"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrCodeImage({
  value,
  size = 280,
}: {
  value: string;
  size?: number;
}) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
    })
      .then((url: string) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl("");
      });

    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div className="w-full flex items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Génération du QR code...
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="QR code" width={size} height={size} />
    </div>
  );
}

