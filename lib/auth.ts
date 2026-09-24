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

export function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case "teacher":
      return "/home";
    case "student":
      return "/student/home";
    case "parent":
      return "/parent/home";
    case "admin":
      return "/admin/home";
  }
}

interface AuthErrorPayload {
  detail?: string;
  message?: string;
  error?: string;
}

function isAuthResponse(value: unknown): value is AuthResponse {
  if (!value || typeof value !== "object") return false;

  const response = value as Partial<AuthResponse>;
  return (
    response.success === true &&
    !!response.user &&
    typeof response.user.name === "string" &&
    typeof response.user.email === "string" &&
    typeof response.user.role === "string"
  );
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authStorageKey = "bloom.auth.user";

async function requestAuth(
  endpoint: "login" | "signup",
  payload: Record<string, string>,
): Promise<AuthResponse> {
  if (!apiUrl) {
    throw new Error(
      "Authentication is not configured. Please set NEXT_PUBLIC_API_URL.",
    );
  }

  let response: Response;

  try {
    response = await fetch(`${apiUrl}/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Unable to connect to the authentication server. Please try again.",
    );
  }

  const data = (await response.json().catch(() => null)) as
    | AuthResponse
    | AuthErrorPayload
    | null;

  if (!response.ok) {
    const errorMessage =
      data && "detail" in data
        ? data.detail
        : data && "message" in data
          ? data.message
          : data && "error" in data
            ? data.error
            : undefined;

    if (response.status === 401) {
      throw new Error(errorMessage || "Invalid email or password.");
    }

    if (response.status === 400) {
      throw new Error(errorMessage || "Please check your information and try again.");
    }

    throw new Error(errorMessage || "Authentication failed. Please try again.");
  }

  if (!isAuthResponse(data)) {
    throw new Error("The authentication server returned an invalid response.");
  }

  window.sessionStorage.setItem(authStorageKey, JSON.stringify(data.user));
  return data;
}

export function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return requestAuth("login", { email, password });
}

export function signupUser(
  name: string,
  email: string,
  password: string,
  role: UserRole,
): Promise<AuthResponse> {
  return requestAuth("signup", { name, email, password, role });
}

export function getCurrentAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const storedUser = window.sessionStorage.getItem(authStorageKey);
  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as AuthUser;
    return user.name && user.email && user.role ? user : null;
  } catch {
    return null;
  }
}
