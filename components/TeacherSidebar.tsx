"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useState } from "react";
import { getCurrentAuthUser } from "@/lib/auth";
import { BloomMark } from "./BloomMark";

function NavIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center text-white">
      {children}
    </span>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0H4Z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 19V5h16v14H4Z" />
      <path d="M7 16v-3m4 3V8m4 8v-5m3 5V7" />
    </svg>
  );
}

function AssignmentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 3h9l3 3v15H6V3Z" />
      <path d="M14 3v4h4M9 11h6M9 15h6M9 19h4" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm7 13 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

function ChangeRoleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 7h12l-3-3m3 3-3 3M20 17H8l3 3m-3-3 3-3" />
    </svg>
  );
}

interface TeacherSidebarProps {
  role?: "teacher" | "student" | "parent" | "admin";
}

export function TeacherSidebar({ role = "teacher" }: TeacherSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isStudent = role === "student";
  const isParent = role === "parent";
  const isAdmin = role === "admin";
  const [accountName] = useState(
    () => {
      const user = getCurrentAuthUser();
      return user?.role === role ? user.name : "—";
    },
  );

  return (
    <aside
      className={`relative flex min-h-screen shrink-0 flex-col overflow-hidden bg-[#0e1521] text-white transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-[88px]" : "w-[294px]"
      }`}
    >
      <div
        className={`flex h-[96px] items-center border-b border-white/10 ${
          collapsed ? "justify-center px-3" : "justify-between px-6"
        }`}
      >
        <BloomMark compact showText={!collapsed} />
        <button
          type="button"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-3xl font-semibold text-white transition hover:bg-white/10 ${
            collapsed ? "absolute left-[88px] -translate-x-1/2 bg-[#0e1521]" : ""
          }`}
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {!collapsed && (
        <div className="border-b border-white/10 px-6 py-5">
          <p className="mb-6 text-base font-semibold uppercase tracking-wide text-white">
            Overview
          </p>
          <div className="space-y-5 text-sm text-white/90">
            <p>
              <span className="font-semibold">Role</span>
              <span className="text-white/60">
                : {isStudent
                  ? "Student"
                  : isParent
                    ? "Parent"
                    : isAdmin
                      ? "School Admin"
                      : "Teacher"}
              </span>
            </p>
            <p className="leading-5">
              <span className="font-semibold">Account</span>
              <span className="text-white/60"> : {accountName}</span>
            </p>
          </div>
        </div>
      )}

      <nav
        className={`border-b border-white/10 py-5 ${
          collapsed ? "px-3" : "px-6"
        }`}
        aria-label="Teacher navigation"
      >
        <div className="space-y-4">
          <Link
            className={`flex items-center text-base font-semibold hover:text-[#c319f4] ${
              collapsed ? "justify-center" : "gap-4"
            }`}
            href={
              isStudent
                ? "/student/home"
                : isParent
                  ? "/parent/home"
                  : isAdmin
                    ? "/admin/home"
                    : "/home"
            }
            title={collapsed ? "Home" : undefined}
          >
            <NavIcon><HomeIcon /></NavIcon>
            {!collapsed && "Home"}
          </Link>
          {!isStudent && !isParent && !isAdmin && <Link
            className={`flex items-center text-base font-semibold hover:text-[#c319f4] ${
              collapsed ? "justify-center" : "gap-4"
            }`}
            href="/students"
            title={collapsed ? "Student" : undefined}
          >
            <NavIcon><StudentIcon /></NavIcon>
            {!collapsed && "Student"}
          </Link>}
          {!isStudent && !isParent && !isAdmin && <Link
            className={`flex items-center text-base font-semibold hover:text-[#c319f4] ${
              collapsed ? "justify-center" : "gap-4"
            }`}
            href="/dashboard"
            title={collapsed ? "Dashboard" : undefined}
          >
            <NavIcon><DashboardIcon /></NavIcon>
            {!collapsed && "Dashboard"}
          </Link>}
          {!isStudent && !isParent && !isAdmin && <Link
            className={`flex items-center text-base font-semibold hover:text-[#c319f4] ${
              collapsed ? "justify-center" : "gap-4"
            }`}
            href="/assignments"
            title={collapsed ? "Assignments" : undefined}
          >
            <NavIcon><AssignmentIcon /></NavIcon>
            {!collapsed && "Assignments"}
          </Link>}
          {isStudent && <Link
            className={`flex items-center text-base font-semibold hover:text-[#c319f4] ${
              collapsed ? "justify-center" : "gap-4"
            }`}
            href="/student/my-learning"
            title={collapsed ? "My Learning" : undefined}
          >
            <NavIcon><DashboardIcon /></NavIcon>
            {!collapsed && "My Learning"}
          </Link>}
          {isStudent && <Link
            className={`flex items-center text-base font-semibold hover:text-[#c319f4] ${
              collapsed ? "justify-center" : "gap-4"
            }`}
            href="/student/assignments"
            title={collapsed ? "Assignments" : undefined}
          >
            <NavIcon><AssignmentIcon /></NavIcon>
            {!collapsed && "Assignments"}
          </Link>}
          {isParent && <Link
            className={`flex items-center text-base font-semibold hover:text-[#c319f4] ${
              collapsed ? "justify-center" : "gap-4"
            }`}
            href="/parent/dashboard"
            title={collapsed ? "Dashboard" : undefined}
          >
            <NavIcon><DashboardIcon /></NavIcon>
            {!collapsed && "Dashboard"}
          </Link>}
          {isAdmin && <Link
            className={`flex items-center text-base font-semibold hover:text-[#c319f4] ${
              collapsed ? "justify-center" : "gap-4"
            }`}
            href="/admin/dashboard"
            title={collapsed ? "Dashboard" : undefined}
          >
            <NavIcon><DashboardIcon /></NavIcon>
            {!collapsed && "Dashboard"}
          </Link>}
          {!isStudent && !isParent && !isAdmin && <Link
            className={`flex items-center text-base font-semibold hover:text-[#c319f4] ${
              collapsed ? "justify-center" : "gap-4"
            }`}
            href="/ai-assistant"
            title={collapsed ? "AI Assistant" : undefined}
          >
            <NavIcon><SparkleIcon /></NavIcon>
            {!collapsed && "AI Assistant"}
          </Link>}
        </div>
      </nav>

      <div className={collapsed ? "px-3 py-8" : "px-6 py-8"}>
        <Link
          className={`flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-[#ff851b] via-[#f84e98] to-[#a900f5] text-base font-bold uppercase text-white ${
            collapsed ? "w-16" : "w-full"
          }`}
          href="/"
          title={collapsed ? "Change role" : undefined}
        >
          {collapsed ? <span className="h-6 w-6"><ChangeRoleIcon /></span> : "Change Role"}
        </Link>
      </div>
    </aside>
  );
}
