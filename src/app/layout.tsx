import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "OTP",
  description: "Generate OTP",
  icons: {
    icon: "/otp.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/otp.png" type="image/png" />
        <link rel="apple-touch-icon" href="/otp.png" />
      </head>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
