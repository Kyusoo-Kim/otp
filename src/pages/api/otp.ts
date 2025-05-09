import { NextApiRequest, NextApiResponse } from "next";
import OTP from "../../otp_machine";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    const clientIp = (req.headers['x-forwarded-for'] as string | string[] | undefined) || req.connection.remoteAddress || '';
    const clientIpString = Array.isArray(clientIp) ? clientIp[0] : clientIp;

    console.log(`origin: ${req.headers.origin}`);

    if (req.method === "POST") {
        // OTP 생성 및 저장
        const otp = OTP.getInstance().generateOTP(clientIpString);

        res.status(201).json(otp);
     
    } else if (req.method === "GET") {
        // OTP 조회
        const otp = OTP.getInstance().getOTP(clientIpString);

        if (otp) {
            res.status(200).json(otp);
        } else {
            res.status(404).json({ message: "OTP not found" });
        }
  
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
