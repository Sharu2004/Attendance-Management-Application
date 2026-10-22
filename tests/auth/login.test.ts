import { DUMMY_USERS } from '../../src/data/dummyUsers';
import { saveSession, getSession } from '../../src/services/storageService';
import { AuthUser } from '../../src/types';

describe('Authentication & Login Validation Workflow', () => {
  // Test authentication function mirroring LoginScreen and AppContext logic
  const authenticate = async (email: string, pass: string) => {
    // 1. Empty field checks
    if (!email.trim() && !pass.trim()) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    if (!email.trim()) {
      return { success: false, error: 'Email address cannot be empty.' };
    }
    if (!pass.trim()) {
      return { success: false, error: 'Password cannot be empty.' };
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, error: 'Please enter a valid email address format.' };
    }

    // 3. User verification against predefined demonstration accounts
    const user = DUMMY_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return { success: false, error: 'User not found with this email address.' };
    }

    if (user.password !== pass) {
      return { success: false, error: 'Incorrect password. Please verify your credentials.' };
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };

    await saveSession(authUser);
    return { success: true, user: authUser };
  };

  test('Login success for Mandatory Account 1: Admin (admin@test.com / Admin@123)', async () => {
    const res = await authenticate('admin@test.com', 'Admin@123');
    expect(res.success).toBe(true);
    expect(res.user?.id).toBe('USR001');
    expect(res.user?.name).toBe('Ram Kumar');
    expect(res.user?.role).toBe('admin');

    const session = await getSession();
    expect(session?.email).toBe('admin@test.com');
  });

  test('Login success for Mandatory Account 2: Senior Staff (senior@test.com / Senior@123)', async () => {
    const res = await authenticate('senior@test.com', 'Senior@123');
    expect(res.success).toBe(true);
    expect(res.user?.id).toBe('USR002');
    expect(res.user?.name).toBe('Nivin Pauly');
    expect(res.user?.role).toBe('senior_staff');

    const session = await getSession();
    expect(session?.email).toBe('senior@test.com');
  });

  test('Login success for Mandatory Account 3: Staff (staff@test.com / Staff@123)', async () => {
    const res = await authenticate('staff@test.com', 'Staff@123');
    expect(res.success).toBe(true);
    expect(res.user?.id).toBe('USR003');
    expect(res.user?.name).toBe('Arjun Kumar');
    expect(res.user?.role).toBe('staff');

    const session = await getSession();
    expect(session?.email).toBe('staff@test.com');
  });

  test('Empty-field validation: returns informative errors when fields are missing', async () => {
    const bothEmpty = await authenticate('', '');
    expect(bothEmpty.success).toBe(false);
    expect(bothEmpty.error).toBe('Please enter both email and password.');

    const emailEmpty = await authenticate('', 'Staff@123');
    expect(emailEmpty.success).toBe(false);
    expect(emailEmpty.error).toBe('Email address cannot be empty.');

    const passEmpty = await authenticate('staff@test.com', '');
    expect(passEmpty.success).toBe(false);
    expect(passEmpty.error).toBe('Password cannot be empty.');
  });

  test('Invalid email format validation', async () => {
    const invalidEmail = await authenticate('not-an-email', 'Staff@123');
    expect(invalidEmail.success).toBe(false);
    expect(invalidEmail.error).toContain('valid email address format');
  });

  test('Invalid credentials rejection: non-existent email', async () => {
    const notFound = await authenticate('ghost@test.com', 'Random@123');
    expect(notFound.success).toBe(false);
    expect(notFound.error).toContain('User not found');
  });

  test('Invalid credentials rejection: incorrect password', async () => {
    const wrongPass = await authenticate('staff@test.com', 'WrongPassword!123');
    expect(wrongPass.success).toBe(false);
    expect(wrongPass.error).toContain('Incorrect password');
  });
});
