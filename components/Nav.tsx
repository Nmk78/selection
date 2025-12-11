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
  ScrollText,
  LogIn,
} from "lucide-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
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
    { href: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    {
      href: "/check",
      icon: <TicketCheck className="w-5 h-5" />,
      label: "Check",
    },
    {
      href: "/policy",
      icon: <ScrollText className="w-5 h-5" />,
      label: "Policy",
    },
  ];

  const adminMenuItem = {
    href: "/admin",
    icon: <Crown className="w-5 h-5" />,
    label: "Admin",
  };

  const menuItems = user ? [...baseMenuItems, adminMenuItem] : baseMenuItems;

  const transformedArchives =
    archives?.map((item) => ({
      href: `/${item._id}`,
      label: item.title || "Untitled",
    })) || [];

  return (
    <nav className="bg-background w-full shadow-lg sticky top-0 z-50">
      <div className="md:max-w-7xl mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" prefetch className="flex-shrink-0">
              <Image
                src="/logo.webp"
                alt="Royal Selection Logo"
                width={50}
                height={50}
                className="h-12 md:h-20 w-auto"
                priority
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <NavLink key={item.href} href={item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}

            {/* Archive Dropdown */}
            <div className="relative">
              <button
                onClick={toggleArchive}
                className="flex items-center py-2 font-bold text-xl text-Cprimary hover:text-Caccent transition duration-300 ease-in-out"
              >
                <Archive className="w-5 h-5 mr-2" />
                Archive
              </button>
              <AnimatePresence>
                {archiveOpen && (
                  <motion.div
                    className="absolute right-0 bg-white shadow-lg rounded-md mt-2 w-max min-w-32 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ul className="py-2">
                      {transformedArchives.length === 0 ? (
                        <li className="px-4 py-2 text-muted-foreground text-sm">
                          No archives yet
                        </li>
                      ) : (
                        transformedArchives.map((item) => (
                          <li key={item.href}>
                            <Link
                              prefetch
                              onClick={toggleArchive}
                              href={`/archive${item.href}`}
                              className="block px-4 py-2 text-Cprimary hover:bg-gray-100 transition"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Authenticated>
              <UserButton />
            </Authenticated>

            <Unauthenticated>
              <Link
                href="/signin"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-Cprimary text-white font-medium hover:bg-Cprimary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </Unauthenticated>
          </div>

          {/* Mobile Menu */}
          <div className="flex justify-center md:hidden gap-2">
            <Authenticated>
              <UserButton />
            </Authenticated>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-Cprimary focus:outline-none focus:ring-inset"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X
                  className="block h-8 w-8 ring-0 text-Cprimary"
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  className="block h-8 w-8 ring-0 text-Cprimary"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden absolute max-w-fit px-5 top-24 right-6 w-full bg-background shadow-lg z-50 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div className="px-2 pt-2 pb-3 space-y-1 divide-y-2 flex flex-col items-end">
              {menuItems.map((item) => (
                <MobileNavLink
                  toggleMenu={toggleMenu}
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                >
                  {item.label}
                </MobileNavLink>
              ))}

              <Unauthenticated>
                <MobileNavLink
                  toggleMenu={toggleMenu}
                  href="/signin"
                  icon={<LogIn className="w-5 h-5" />}
                >
                  Sign In
                </MobileNavLink>
              </Unauthenticated>

              {/* Archive in Mobile Menu */}
              <div className="w-full">
                <button
                  onClick={toggleArchive}
                  className="flex items-center font-medium text-Cprimary hover:text-Caccent transition duration-300 px-3 py-2 w-full justify-end"
                >
                  <Archive className="w-5 h-5 mr-2" />
                  Archive
                </button>
                <AnimatePresence>
                  {archiveOpen && (
                    <motion.div
                      className="mt-2 space-y-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {transformedArchives.length === 0 ? (
                        <p className="text-sm text-muted-foreground px-3 py-2 text-right">
                          No archives yet
                        </p>
                      ) : (
                        transformedArchives.map((item) => (
                          <MobileNavLink
                            toggleMenu={toggleMenu}
                            key={item.href}
                            href={`/archive${item.href}`}
                            icon={null}
                          >
                            {item.label}
                          </MobileNavLink>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link
      prefetch
      href={href}
      className="font-bold text-xl text-Cprimary hover:text-Caccent px-3 py-2 rounded-md flex items-center transition duration-300 ease-in-out group"
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  icon,
  toggleMenu,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode | null;
  toggleMenu: () => void;
}) {
  return (
    <Link
      prefetch
      href={href}
      onClick={toggleMenu}
      className="text-Cprimary hover:text-Caccent w-full px-3 py-2 rounded-md text-base font-medium flex items-end transition duration-300 ease-in-out"
    >
      {icon && <span>{icon}</span>}
      <span className="ml-2 text-end">{children}</span>
    </Link>
  );
}
