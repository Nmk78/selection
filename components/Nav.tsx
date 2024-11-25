'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Crown, Menu, X } from 'lucide-react'

interface NavbarProps {
  isAdmin: boolean
}

export default function Nav({ isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { href: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    ...(isAdmin ? [{ href: '/admin', icon: <Crown className="w-5 h-5" />, label: 'Admin' }] : []),
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <nav className="bg-background w-full shadow-lg sticky top-0 z-50">
      <div className="md:max-w-7xl mx-auto px-6 md:px-0">
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
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-Cprimary focus:outline-none focus:ring-inset"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="block h-6 w-6 ring-0 text-Cprimary" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6 ring-0 text-Cprimary" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden absolute max-w-fit px-5 top-24 right-6 w-full bg-background shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="px-2 pt-2 pb-3 space-y-1 divide-y flex flex-col items-end"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {menuItems.map((item) => (
                <MobileNavLink 
                  key={item.href} 
                  href={item.href} 
                  icon={item.icon}
                  variants={itemVariants}
                >
                  {item.label}
                </MobileNavLink>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link href={href} className="font-bold text-xl text-Cprimary hover:text-Caccent px-3 py-2 rounded-md flex items-center transition duration-300 ease-in-out group">
      <span className="relative">
        {icon}
        <motion.span
          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-Caccent transition-all duration-300 ease-in-out group-hover:w-full"
          initial={false}
          animate={{ width: "0%" }}
          whileHover={{ width: "100%" }}
        />
      </span>
      <span className="ml-2">{children}</span>
    </Link>
  )
}

function MobileNavLink({ href, children, icon, variants }: { href: string; children: React.ReactNode; icon: React.ReactNode; variants: any }) {
  return (
    <motion.div variants={variants}>
      <Link href={href} className="text-Cprimary hover:text-Caccent px-3 py-2 rounded-md text-base font-medium flex items-center transition duration-300 ease-in-out">
        {icon}
        <span className="ml-2">{children}</span>
      </Link>
    </motion.div>
  )
}

