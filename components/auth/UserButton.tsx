"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import {
  LogOut, ChevronDown, Settings,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UserButton() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.current);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/");
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U";

  const isAdmin = user.role === "admin";

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-sm overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-candidate-male-100 via-candidate-female-50 to-candidate-male-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Avatar with gradient border */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-candidate-male-500 to-candidate-female-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-candidate-male-600 to-candidate-female-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
            {initials}
          </div>
          {isAdmin && (
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-3.5 h-3.5 text-candidate-female-500 fill-candidate-female-500" />
            </div>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-candidate-male-700 transition-transform duration-300 relative z-10 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-candidate-male-100/50 overflow-hidden z-50"
            >
              {/* Header with gradient */}
              <div className="relative p-5 bg-gradient-to-br from-candidate-male-50 via-candidate-female-50/50 to-candidate-male-50 border-b border-candidate-male-100/50">
                {/* Decorative sparkles */}
                <div className="absolute top-3 right-3">
                  <Sparkles className="w-4 h-4 text-candidate-female-400 animate-pulse" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-candidate-male-500 to-candidate-female-500 rounded-full blur-md opacity-50" />
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-candidate-male-600 to-candidate-female-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {initials}
                    </div>
                    {isAdmin && (
                      <div className="absolute -top-1 -right-1 bg-candidate-female-500 rounded-full p-1 shadow-md">
                        <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-candidate-male-900 truncate text-base">
                      {user.name || "User"}
                    </p>
                    <p className="text-sm text-candidate-male-600/70 truncate mt-0.5">
                      {user.email}
                    </p>
                    {isAdmin && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-candidate-female-700 bg-gradient-to-r from-candidate-female-100 to-candidate-male-100 rounded-full px-3 py-1 w-fit"
                      >
                        <ShieldCheck className="w-3 h-3 text-candidate-female-500" />
                        <span>Administrator</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {isAdmin && (
                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/admin");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-candidate-male-700 hover:bg-gradient-to-r hover:from-candidate-male-50 hover:to-candidate-female-50 rounded-xl transition-all duration-200 group"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-candidate-male-100 to-candidate-female-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="w-4 h-4 text-candidate-male-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Dashboard</p>
                      <p className="text-xs text-candidate-male-600/60">
                        Manage system
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-candidate-male-400 rotate-[-90deg]" />
                  </motion.button>
                )}

                <motion.button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group mt-1"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Sign Out</p>
                    <p className="text-xs text-red-600/60">Leave session</p>
                  </div>
                </motion.button>
              </div>

              {/* Footer decoration */}
              <div className="h-px bg-gradient-to-r from-transparent via-candidate-male-200 to-transparent" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
