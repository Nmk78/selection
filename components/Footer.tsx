"use client";

import { FolderGit, FolderGit2, Github, Laptop, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden">
      {/* Elegant gradient background with subtle glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-candidate-male-50/40 to-candidate-female-50/30 backdrop-blur-sm" />

      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-candidate-male-400 via-candidate-female-400 to-transparent opacity-60" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Purpose Section */}
          <motion.div
            className="text-center w-full max-w-7xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-geistMono mb-4 bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Purpose
            </h2>
            <div className="w-24 h-0.5 mx-auto mb-6 bg-gradient-to-r from-transparent via-candidate-male-400 via-candidate-female-400 to-transparent rounded-full" />
            <p className="font-geistSans font-light text-sm sm:text-base text-candidate-male-700 leading-relaxed">
              This website has been developed as a personal project with the
              primary objective of serving as an online voting system within the{" "}
              <strong className="font-semibold text-candidate-male-800">
                Polytechnic University (Myeik)
              </strong>
              . The main purpose is to simplify and enhance the voting process,
              providing a user-friendly platform for the PU Myeik community to
              engage in online voting seamlessly.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-6 sm:gap-8 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SocialLink
              href="mailto:naymyokhant78@gmail.com"
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              delay={0}
            />
            <SocialLink
              href="https://github.com/Nmk78/"
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
              delay={0.1}
            />
            <SocialLink
              href="http://naymyokhant.online"
              icon={<Laptop className="w-5 h-5" />}
              label="Portfolio"
              delay={0.2}
              external
            />{" "}
            <SocialLink
              href="https://www.naymyokhant.online/project/672c471a90a3619dbf395b64"
              icon={<FolderGit2 className="w-5 h-5" />}
              label="V1"
              delay={0.2}
              external
            />{" "}
            <SocialLink
              href="https://www.naymyokhant.online/project/67958c5755186cb48a1060d1"
              icon={<FolderGit className="w-5 h-5" />}
              label="V2"
              delay={0.2}
              external
            />
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="pt-4 border-t border-candidate-male-200/50 w-full max-w-3xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-center text-xs sm:text-sm text-candidate-male-600/70 font-geistSans font-light">
              © {new Date().getFullYear()} PU Selection. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  delay?: number;
  external?: boolean;
}

const SocialLink = ({
  href,
  icon,
  label,
  delay = 0,
  external = false,
}: SocialLinkProps) => {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="relative group"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background glow effect */}
      <div title={label} className="absolute inset-0 bg-gradient-to-br from-candidate-male-400/20 to-candidate-female-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

      {/* Icon container */}
      <div className="relative p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-candidate-male-200/50 group-hover:border-candidate-male-400/50 transition-all duration-300 shadow-sm group-hover:shadow-md">
        <div className="text-candidate-male-600 group-hover:text-candidate-male-700 transition-colors duration-300">
          {icon}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-candidate-male-500 to-candidate-female-500 group-hover:w-full transition-all duration-300 rounded-full" />
    </motion.a>
  );
};

export default Footer;
