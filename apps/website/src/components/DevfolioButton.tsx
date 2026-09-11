"use client";

import { useEffect } from "react";

const DEVFOLIO_SDK_ID = "devfolio-apply-sdk";

export default function DevfolioButton() {
  useEffect(() => {
    if (document.getElementById(DEVFOLIO_SDK_ID)) {
      return;
    }

    const script = document.createElement("script");
    script.id = DEVFOLIO_SDK_ID;
    script.src = "https://apply.devfolio.co/v2/sdk.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="apply-button"
      data-hackathon-slug="HACKURITY"
      data-button-theme="dark"
      style={{
        height: "44px",
        width: "312px",
      }}
    />
  );
}