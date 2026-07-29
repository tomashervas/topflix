/**
 * In-memory store for device login codes.
 * Codes live for 5 minutes max — no database needed.
 * 
 * On Vercel serverless, this store lives per-instance. Since the TV polls
 * frequently (every 4s), it will hit the same warm instance that created
 * the code in most cases. For a private family app this is sufficient.
 */

interface DeviceCode {
    code: string;
    status: 'pending' | 'completed';
    token?: string;        // JWT generated for the TV once verified
    expiresAt: number;     // Unix timestamp in ms
}

// Global store to survive hot reloads in development
const globalForDeviceCodes = globalThis as unknown as {
    deviceCodes: Map<string, DeviceCode>;
};

const deviceCodes: Map<string, DeviceCode> = globalForDeviceCodes.deviceCodes || new Map();

if (process.env.NODE_ENV !== 'production') {
    globalForDeviceCodes.deviceCodes = deviceCodes;
}

const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CODE_LENGTH = 6;

/**
 * Generates a random alphanumeric code (uppercase only, no ambiguous chars).
 * Excludes O/0/I/1/L to avoid confusion on TV screens.
 */
function generateCode(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/** Remove expired codes to prevent memory leaks */
function cleanup(): void {
    const now = Date.now();
    deviceCodes.forEach((value, key) => {
        if (now > value.expiresAt) {
            deviceCodes.delete(key);
        }
    });
}

export function createDeviceCode(): { code: string; expiresIn: number } {
    cleanup();

    // Ensure unique code
    let code: string;
    do {
        code = generateCode();
    } while (deviceCodes.has(code));

    deviceCodes.set(code, {
        code,
        status: 'pending',
        expiresAt: Date.now() + CODE_TTL_MS,
    });

    return { code, expiresIn: Math.floor(CODE_TTL_MS / 1000) };
}

export function getDeviceCode(code: string): DeviceCode | null {
    cleanup();
    const entry = deviceCodes.get(code.toUpperCase());
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        deviceCodes.delete(code);
        return null;
    }
    return entry;
}

export function completeDeviceCode(code: string, token: string): boolean {
    const entry = deviceCodes.get(code.toUpperCase());
    if (!entry || entry.status !== 'pending' || Date.now() > entry.expiresAt) {
        return false;
    }
    entry.status = 'completed';
    entry.token = token;
    return true;
}
