"use client";

import { useState } from "react";

export default function Home() {
  const [otp, setOtp] = useState<string | null>(null);

  const generateOtp = async () => {
    try {
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOtp(data); // OTP 결과 저장

        // 클립보드에 복사
        const textarea = document.createElement("textarea");
        textarea.value = data; // 복사할 데이터
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } else {
        setOtp("Failed to generate OTP");
      }
    } catch (error) {
      setOtp("Error occurred while generating OTP");
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <button className="btn" onClick={generateOtp}> Generate OTP </button>
      <p className="m-10 text-4xl">{otp || "OTP"}</p>
    </div>
  );
}
