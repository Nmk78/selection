"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown, Shield } from "lucide-react";
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-Cprimary/10 hover:bg-Cprimary/20 transition-all duration-200 border border-Cprimary/20"
      >
        <div className="w-8 h-8 rounded-full bg-Cprimary text-white flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-Cprimary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-4 bg-gradient-to-br from-Cprimary/5 to-Cprimary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-Cprimary text-white flex items-center justify-center text-lg font-semibold">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-Cprimary truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              {user.role === "admin" && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-Cprimary bg-Cprimary/10 rounded-full px-2 py-1 w-fit">
                  <Shield className="w-3 h-3" />
                  Admin
                </div>
              )}
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/admin");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
