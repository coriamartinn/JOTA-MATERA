import { createHmac } from 'crypto';

export class AuthService {
  private readonly tokenSecret =
    process.env.ADMIN_TOKEN_SECRET || 'jota-matera-admin-secret';

  private buildToken(username: string) {
    const payload = JSON.stringify({
      username,
      role: 'admin',
      issuedAt: Date.now(),
    });
    const signature = createHmac('sha256', this.tokenSecret)
      .update(payload)
      .digest('hex');

    return Buffer.from(`${payload}.${signature}`).toString('base64url');
  }

  validateAdminLogin(payload: { username: string; password: string }) {
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (
      payload.username === expectedUsername &&
      payload.password === expectedPassword
    ) {
      const token = this.buildToken(payload.username);
      return { ok: true, role: 'admin', token };
    }

    return { ok: false };
  }

  verifyAdminToken(token: string | undefined) {
    if (!token) {
      return { ok: false };
    }

    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf8');
      const separatorIndex = decoded.lastIndexOf('.');

      if (separatorIndex === -1) {
        return { ok: false };
      }

      const payload = decoded.slice(0, separatorIndex);
      const signature = decoded.slice(separatorIndex + 1);

      const expectedSignature = createHmac('sha256', this.tokenSecret)
        .update(payload)
        .digest('hex');

      if (signature !== expectedSignature) {
        return { ok: false };
      }

      const parsedPayload = JSON.parse(payload) as {
        username?: string;
        role?: string;
      };

      if (
        parsedPayload.role !== 'admin' ||
        parsedPayload.username !== (process.env.ADMIN_USERNAME || 'admin')
      ) {
        return { ok: false };
      }

      return { ok: true, role: 'admin' };
    } catch {
      return { ok: false };
    }
  }
}
