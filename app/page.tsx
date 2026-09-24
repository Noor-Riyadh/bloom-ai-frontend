"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRoleHomePath,
  loginUser,
  signupUser,
  type UserRole,
} from "@/lib/auth";

const roles: Array<{ value: UserRole; label: string }> = [
  { value: "teacher", label: "Teacher" },
  { value: "parent", label: "Parent" },
  { value: "student", label: "Student" },
  { value: "admin", label: "School Admin" },
];

const demoAccounts: Array<{
  label: string;
  email: string;
  password: string;
}> = [
  {
    label: "Login as Teacher",
    email: "SaraHassan1@gmail.com",
    password: "123456",
  },
  {
    label: "Login as Student",
    email: "AhmedAli1@gmail.com",
    password: "123456",
  },
  {
    label: "Login as Parent",
    email: "ahmed123@gmail.com",
    password: "123456",
  },
  {
    label: "Login as Admin",
    email: "NileFuture@gmail.com",
    password: "123456",
  },
];

function BloomLogo() {
  return (
    <svg
      aria-label="Bloom"
      className="h-[106px] w-[106px] shrink-0"
      viewBox="0 0 106 106"
      role="img"
    >
      <rect width="106" height="106" rx="20" fill="#151515" />
      <circle cx="53" cy="32" r="12" fill="#b5f51c" />
      <path
        d="M19 42c25 2 39 16 39 43-24-1-39-15-39-43Z"
        fill="#ff851b"
      />
      <path
        d="M87 42C62 44 48 58 48 85c24-1 39-15 39-43Z"
        fill="#7539ee"
      />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("teacher");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function switchMode(nextIsSignup: boolean) {
    setIsSignup(nextIsSignup);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = isSignup
        ? await signupUser(name, email, password, role)
        : await loginUser(email, password);

      setSuccess(
        isSignup
          ? `Welcome, ${response.user.name}! Your account is ready.`
          : `Welcome back, ${response.user.name}!`,
      );
      router.push(getRoleHomePath(response.user.role));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }

  }

  async function handleDemoLogin(
    email: string,
    password: string,
  ) {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(email, password);
      router.push(getRoleHomePath(response.user.role));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to log in with this demo account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-[#111111]">
      <section className="w-full max-w-[500px]">
        <div className="mb-[51px] flex items-center gap-[57px]">
          <BloomLogo />
          <div>
            <div className="mb-[14px] h-[6px] w-[56px] bg-[#bd0cf4]" />
            <h1 className="font-sans text-[44px] font-extrabold leading-[0.9] tracking-[-2px] text-[#a30bed]">
              Welcome
            </h1>
            <p className="font-sans text-[44px] font-extrabold leading-[0.9] tracking-[-2px]">
              To Bloom
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#ffae48] via-[#e947c8] to-[#be40ff]" />

        <form
          className="mt-[27px] flex flex-col gap-[14px]"
          onSubmit={handleSubmit}
        >
          {isSignup && (
            <label className="flex flex-col gap-[8px]">
              <span className="text-center text-[16px] font-semibold uppercase tracking-[-0.1px] text-[#a400ff]">
                Your name
              </span>
              <input
                required
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                className="h-[36px] rounded-[10px] border border-[#f56c9e] bg-white px-5 text-[15px] font-medium outline-none transition placeholder:text-[#777] focus:border-[#a400ff] focus:ring-1 focus:ring-[#d64cf1]"
              />
            </label>
          )}

          <label className="flex flex-col gap-[8px]">
            <span className="text-center text-[16px] font-semibold uppercase tracking-[-0.1px] text-[#a400ff]">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="h-[36px] rounded-[10px] border border-[#f56c9e] bg-white px-5 text-[15px] font-medium outline-none transition placeholder:text-[#777] focus:border-[#a400ff] focus:ring-1 focus:ring-[#d64cf1]"
            />
          </label>

          <label className="flex flex-col gap-[8px]">
            <span className="text-center text-[16px] font-semibold uppercase tracking-[-0.1px] text-[#a400ff]">
              Password
            </span>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-[36px] rounded-[10px] border border-[#f56c9e] bg-white px-5 text-[15px] font-medium outline-none transition placeholder:text-[#777] focus:border-[#a400ff] focus:ring-1 focus:ring-[#d64cf1]"
            />
          </label>

          {isSignup && (
            <label className="flex flex-col gap-[8px]">
              <span className="text-center text-[16px] font-semibold uppercase tracking-[-0.1px] text-[#a400ff]">
                Choose your role
              </span>
              <select
                required
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="h-[36px] appearance-none rounded-[10px] border border-[#f56c9e] bg-white px-5 text-[15px] font-medium outline-none focus:border-[#a400ff] focus:ring-1 focus:ring-[#d64cf1]"
              >
                {roles.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {(error || success) && (
            <p
              aria-live="polite"
              className={`text-center text-[14px] font-medium ${
                error ? "text-[#d83364]" : "text-[#568500]"
              }`}
            >
              {error || success}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-[5px] h-[36px] rounded-[8px] bg-gradient-to-r from-[#ff851b] via-[#f84e98] to-[#a900f5] text-[13px] font-bold uppercase text-white shadow-sm transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#d64cf1] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? "Please wait..." : isSignup ? "Sign Up" : "Continue"}
          </button>
        </form>

        {!isSignup && (
          <section className="mt-[26px] border-t border-[#ead7f4] pt-[18px]">
            <p className="text-center text-[13px] font-semibold uppercase tracking-[0.5px] text-[#777]">
              Demo Accounts
            </p>
            <div className="mt-[12px] grid grid-cols-4 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    handleDemoLogin(
                      account.email,
                      account.password,
                    )
                  }
                  className="min-h-[40px] rounded-[8px] border border-[#d9b6ea] bg-[#fcf8ff] px-2 py-1 text-[12px] font-semibold leading-tight text-[#8b10c6] transition hover:border-[#a400ff] hover:bg-[#f4e6ff] focus:outline-none focus:ring-2 focus:ring-[#d64cf1] disabled:cursor-wait disabled:opacity-60"
                >
                  {account.label}
                </button>
              ))}
            </div>
          </section>
        )}

        <p className="mt-[19px] text-center text-[15px] text-[#555]">
          {isSignup ? "Already have an account?" : "New to Bloom?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(!isSignup)}
            className="font-semibold text-[#a400ff] underline decoration-transparent underline-offset-2 transition hover:decoration-current"
          >
            {isSignup ? "Log in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}
