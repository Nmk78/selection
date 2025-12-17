"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Crown,
  Menu,
  X,
  Archive,
  TicketCheck,
  ScrollText, Sparkles
} from "lucide-react";
import { Authenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import UserButton from "@/components/auth/UserButton";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const user = useQuery(api.users.current);
  const archiveQueryResult = useQuery(api.archive.getArchiveMetadatas);
  const archives = archiveQueryResult?.data || [];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleArchive = () => setArchiveOpen(!archiveOpen);

  const baseMenuItems = [
    { href: "/", icon: <Home className="w-4 h-4" />, label: "Home" },
    {
      href: "/check",
      icon: <TicketCheck className="w-4 h-4" />,
      label: "Check",
    },
    {
      href: "/policy",
      icon: <ScrollText className="w-4 h-4" />,
      label: "Policy",
    },
  ];

  const transformedArchives =
    archives?.map((item) => ({
      href: `/${item._id}`,
      label: item.title || "Untitled",
    })) || [];

  return (
    <nav className="relative w-full sticky top-0 z-50">
      {/* Elegant gradient background with subtle glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white backdrop-blur-xl border-b border-purple-100/50" />
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 via-amber-400 to-transparent opacity-60" />
      
      <div className="relative md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with elegant styling */}
          <Link
            href="/"
            prefetch
            className="flex-shrink-0 group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-amber-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/logo.webp"
                  alt="PU Logo"
                  width={50}
                  height={50}
                  className="h-12 md:h-16 w-auto drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  PU Selection
                </h1>
                <p className="text-xs text-purple-600/70 font-medium">
                  Be the Judge!
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {baseMenuItems.map((item, index) => (
              <NavLink key={item.href} href={item.href} icon={item.icon} delay={index * 0.1}>
                {item.label}
              </NavLink>
            ))}

            {/* Archive Dropdown with elegant styling */}
            <div className="relative">
              <button
                onClick={toggleArchive}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-purple-700 hover:text-purple-900 transition-all duration-300 group"
              >
                <Archive className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>Archive</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-amber-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </button>
              <AnimatePresence>
                {archiveOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={toggleArchive}
                    />
                    <motion.div
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-100/50 overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2">
                        {transformedArchives.length === 0 ? (
                          <div className="px-4 py-6 text-center">
                            <Archive className="w-8 h-8 mx-auto text-purple-300 mb-2" />
                            <p className="text-sm text-purple-600/60">
                              No archives yet
                            </p>
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto">
                            {transformedArchives.map((item, index) => (
                              <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  prefetch
                                  onClick={toggleArchive}
                                  href={`/archive${item.href}`}
                                  className="block px-4 py-3 rounded-lg text-sm font-medium text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-amber-50 transition-all duration-200 group"
                                >
                                  <span className="flex items-center gap-2">
                                    <Crown className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="truncate">{item.label}</span>
                                  </span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>


            <Authenticated>
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-purple-200 to-transparent mx-2" />
              <UserButton />
            </Authenticated>

            {/* <Unauthenticated>
              <Link
                href="/signin"
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 group-hover:from-purple-700 group-hover:via-purple-600 group-hover:to-amber-600 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <LogIn className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Sign In</span>
              </Link>
            </Unauthenticated> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <Authenticated>
              <UserButton />
            </Authenticated>
            <button
              onClick={toggleMenu}
              className="relative p-2.5 rounded-xl text-purple-700 hover:bg-purple-50 transition-all duration-200"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />
            <motion.div
              className="fixed top-20 right-4 left-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-100/50 z-50 lg:hidden overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 space-y-1">
                {baseMenuItems.map((item, index) => (
                  <MobileNavLink
                    toggleMenu={toggleMenu}
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    delay={index * 0.1}
                  >
                    {item.label}
                  </MobileNavLink>
                ))}

                <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent my-2" />

                {/* <Unauthenticated>
                  <MobileNavLink
                    toggleMenu={toggleMenu}
                    href="/signin"
                    icon={<LogIn className="w-4 h-4" />}
                    delay={0.3}
                  >
                    Sign In
                  </MobileNavLink>
                </Unauthenticated> */}

                {/* Archive in Mobile Menu */}
                <div className="pt-2">
                  <button
                    onClick={toggleArchive}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-purple-700 hover:bg-purple-50 transition-all duration-200"
                  >
                    <span className="flex items-center gap-2">
                      <Archive className="w-4 h-4" />
                      Archive
                    </span>
                    <motion.div
                      animate={{ rotate: archiveOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Crown className="w-4 h-4 text-amber-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {archiveOpen && (
                      <motion.div
                        className="mt-2 space-y-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {transformedArchives.length === 0 ? (
                          <div className="px-4 py-4 text-center">
                            <p className="text-sm text-purple-600/60">
                              No archives yet
                            </p>
                          </div>
                        ) : (
                          transformedArchives.map((item, index) => (
                            <MobileNavLink
                              toggleMenu={toggleMenu}
                              key={item.href}
                              href={`/archive${item.href}`}
                              icon={<Crown className="w-3.5 h-3.5 text-amber-500" />}
                              delay={index * 0.05}
                            >
                              {item.label}
                            </MobileNavLink>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({
  href,
  children,
  icon,
  delay = 0,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <Link prefetch href={href}>
      <motion.div
        className="relative px-4 py-2.5 rounded-xl font-semibold text-sm text-purple-700 hover:text-purple-900 transition-all duration-300 group"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-amber-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        <div className="flex items-center gap-2">
          <span className="transition-transform group-hover:scale-110">
            {icon}
          </span>
          <span>{children}</span>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-amber-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
      </motion.div>
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  icon,
  toggleMenu,
  delay = 0,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode | null;
  toggleMenu: () => void;
  delay?: number;
}) {
  return (
    <Link prefetch href={href} onClick={toggleMenu}>
      <motion.div
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-amber-50 transition-all duration-200 group"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        whileTap={{ scale: 0.98 }}
      >
        {icon && (
          <span className="text-purple-500 group-hover:scale-110 transition-transform">
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
        <Crown className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </Link>
  );
}
