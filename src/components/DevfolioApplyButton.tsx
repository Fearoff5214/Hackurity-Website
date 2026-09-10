"use client";

import { useEffect } from "react";

const DEVFOLIO_SDK_SRC = "https://apply.devfolio.co/v2/sdk.js";

export default function DevfolioApplyButton({ className }: { className?: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = DEVFOLIO_SDK_SRC;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className={`apply-button ${className ?? ""}`}
      data-hackathon-slug="hackurity"
      data-button-theme="dark"
      style={{ height: 44, width: 312 }}
    />
  );
}
