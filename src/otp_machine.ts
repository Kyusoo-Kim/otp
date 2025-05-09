import crypto from "crypto";
import config from "config";

// OTP 유지 시간 (초)
const OTP_EXPIRATION = Number(config.get("OTP_EXPIRATION")) || 30;

export default class OTPMachine {
    private static instance: OTPMachine; // 싱글톤 인스턴스
    private otpStore: Record<string, string> = {}; // OTP 저장소
    private expirationTime: number; // OTP 만료 시간 (초)

    private constructor(expirationTime: number = OTP_EXPIRATION) {
        this.otpStore = {};
        this.expirationTime = expirationTime;
    }

    // 싱글톤 인스턴스를 반환하는 메서드
    public static getInstance(expirationTime: number = OTP_EXPIRATION): OTPMachine {
        if (!OTPMachine.instance) {
            OTPMachine.instance = new OTPMachine(expirationTime);
        }
        return OTPMachine.instance;
    }

    generateOTP(clientIp: string): string {
        const now = Math.floor(Date.now() / 1000);
        const SALT = clientIp + config.get('SALT') || 'default_salt';
        const hash = crypto.createHash('sha256').update(now.toString() + SALT).digest('hex');
        const numbersOnly = hash.replace(/\D/g, ''); // 숫자만 추출
        const otp = numbersOnly.substring(0, 6).padEnd(6, '0'); // 앞에서 6자리만 반환 (숫자가 충분하지 않을 경우 대체 처리)

        this.otpStore[clientIp] = otp;

        console.log(this.otpStore);

        setTimeout(() => {
            if (this.otpStore[clientIp] === otp) {
                delete this.otpStore[clientIp];
            }
        }, this.expirationTime * 1000);

        return otp;
    }

    getOTP(clientIp: string): string | null {
        return this.otpStore[clientIp] || null;
    }
}