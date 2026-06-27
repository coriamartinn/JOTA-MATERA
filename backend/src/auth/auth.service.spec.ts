import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('acepta las credenciales de admin configuradas', () => {
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'admin123';

    const result = service.validateAdminLogin({
      username: 'admin',
      password: 'admin123',
    });

    expect(result.ok).toBe(true);
    expect(result.role).toBe('admin');
    expect(result.token).toBeDefined();
  });

  it('rechaza credenciales inválidas', () => {
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'admin123';

    const result = service.validateAdminLogin({
      username: 'admin',
      password: 'wrong-password',
    });

    expect(result).toEqual({ ok: false });
  });

  it('valida un token válido de admin', () => {
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'admin123';

    const login = service.validateAdminLogin({
      username: 'admin',
      password: 'admin123',
    });

    const verified = service.verifyAdminToken(login.token as string);

    expect(verified).toEqual({ ok: true, role: 'admin' });
  });
});
