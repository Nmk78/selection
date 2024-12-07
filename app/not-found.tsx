"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { usePathname } from "next/navigation";

export default function NotFound() {
  return (
    <div className="w-full h-[90vh]">
      <EvervaultCard text="404" />
    </div>
  );
}
