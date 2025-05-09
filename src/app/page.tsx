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
      <p className="m-10">{otp || "OTP"}</p>
    </div>
  );
}
