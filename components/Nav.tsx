"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Crown, Menu, X, Archive } from "lucide-react";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";

interface NavbarProps {
  isAdmin: boolean;
}

export default function Nav({ isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false); // State for archive dropdown
  const [archives, setArchives] = useState<{ href: string; label: string }[]>([
    { href: "/2023", label: "2023" },
    { href: "/2024", label: "2024" },
  ]); // State to store fetched archives

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleArchive = () => setArchiveOpen(!archiveOpen);

  const menuItems = [
    { href: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    ...(isAdmin
      ? [
          {
            href: "/admin",
            icon: <Crown className="w-5 h-5" />,
            label: "Admin",
          },
        ]
      : []),
  ];

  // Fetch archives from backend
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch("/api/archives"); // Replace with your backend endpoint
        const data = await response.json();
        setArchives(data); // Assuming the backend sends an array of { href, label }
      } catch (error) {
        console.error("Failed to fetch archives:", error);
      }
    };

    fetchArchives();
  }, []);

  return (
    <nav className="bg-background w-full shadow-lg sticky top-0 z-50">
      <div className="md:max-w-7xl mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.webp"
                alt="Royal Selection Logo"
                width={50}
                height={50}
                className="h-12 md:h-20 w-auto"
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
                    transition={{ duration: 0.3 }}
                  >
                    <ul className="py-2">
                      {archives.map((item) => (
                        <li key={item.href}>
                          <Link
                          onClick={toggleArchive}
                            href={`/archive${item.href}`}
                            className="block px-4 py-2 text-Cprimary hover:bg-gray-100 transition"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu */}
          <div className="flex justify-center md:hidden">
            <SignedIn>
              <UserButton />
            </SignedIn>
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
            className="md:hidden absolute max-w-fit px-5 top-24 right-6 w-full bg-background shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
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
              {/* Archive in Mobile Menu */}
              <div>
                <button
                  onClick={toggleArchive}
                  className="flex items-center font-medium text-Cprimary hover:text-Caccent transition duration-300 px-3"
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
                      transition={{ duration: 0.3 }}
                    >
                      {archives.map((item) => (
                        <MobileNavLink
                          toggleMenu={toggleMenu}
                          key={item.href}
                          href={`/archive${item.href}`}
                          icon={null}
                        >
                          {item.label}
                        </MobileNavLink>
                      ))}
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
      href={href}
      onClick={toggleMenu}
      className="text-Cprimary hover:text-Caccent w-full px-3 py-2 rounded-md text-base font-medium flex items-end transition duration-300 ease-in-out"
    >
      {icon && <span>{icon}</span>}
      <span className="ml-2 text-end">{children}</span>
    </Link>
  );
}
