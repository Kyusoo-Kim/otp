import { NextApiRequest, NextApiResponse } from "next";
import config from "config";
import OTP from "../../otp_machine";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientIp = (req.headers['x-forwarded-for'] as string | string[] | undefined) || req.connection.remoteAddress || '';
    const clientIpString = Array.isArray(clientIp) ? clientIp[0] : clientIp;

    // 허용할 출처 목록
    const allowedOrigins = config.get("ALLOWED_ORIGINS") as string[] || [];
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // 요청한 출처를 허용
    }

    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // 허용할 메서드
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // 허용할 헤더

    console.log(`METHOD[${req.method}] / clientIp: ${clientIpString}`);

    if (req.method === "OPTIONS") {
        // Preflight 요청에 대한 응답
        res.status(200).end();
        return;
    }

    if (req.method === "POST") {
        const { value } = req.body;

        console.log(`/auth : ${value}`);

        const otp = OTP.getInstance().getOTP(clientIpString);
        if (otp === value) {
            res.status(200).json({ message: "OTP is valid" });
        } else {
            res.status(401).json({ message: "Invalid OTP" });
        }
    } else {
        // 허용되지 않은 메서드에 대한 응답
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}