export type UserRole = "teacher" | "parent" | "student" | "admin";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  success: true;
  user: AuthUser;
}

const mockDelay = (milliseconds = 450) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

export async function loginUser(
  email: string,
  _password: string,
): Promise<AuthResponse> {
  void _password;
  await mockDelay();

  return {
    success: true,
    user: {
      name: email.split("@")[0] || "Bloom user",
      email,
      role: "student",
    },
  };
}

export async function signupUser(
  name: string,
  email: string,
  _password: string,
  role: UserRole,
): Promise<AuthResponse> {
  void _password;
  await mockDelay();

  return {
    success: true,
    user: { name, email, role },
  };
}
