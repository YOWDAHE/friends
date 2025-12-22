import jwt from "jsonwebtoken";

const STAFF_JWT_SECRET = process.env.STAFF_JWT_SECRET!;
if (!STAFF_JWT_SECRET) {
    throw new Error("STAFF_JWT_SECRET is not set");
}

export type StaffTokenPayload = {
    role: "STAFF";
    sub: string; // e.g. "staff"
    iat: number;
    exp: number;
};

export function signStaffToken(): string {
    const payload = { role: "STAFF", sub: "staff" };
    return jwt.sign(payload, STAFF_JWT_SECRET, { expiresIn: "8h" });
}

export function verifyStaffToken(token: string): StaffTokenPayload | null {
    try {
        return jwt.verify(token, STAFF_JWT_SECRET) as StaffTokenPayload;
    } catch {
        return null;
    }
}
