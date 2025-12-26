"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, Star } from "lucide-react";
import { winnerCandidate } from "@/types/types";
import { motion } from "framer-motion";

interface ResultsProps {
  results: winnerCandidate[];
}

export default function Results({ results }: ResultsProps) {
  const getTitleConfig = (title: string) => {
    switch (title) {
      case "King":
        return {
          gradient: "from-candidate-male-500 via-candidate-male-600 to-candidate-male-700",
          bgGradient: "from-candidate-male-500/20 via-candidate-male-400/10 to-transparent",
          border: "border-candidate-male-400/50",
          text: "text-candidate-male-700",
          badge: "bg-candidate-male-500",
          glow: "shadow-candidate-male-500/50",
        };
      case "Queen":
        return {
          gradient: "from-candidate-female-500 via-candidate-female-600 to-candidate-female-700",
          bgGradient: "from-candidate-female-500/20 via-candidate-female-400/10 to-transparent",
          border: "border-candidate-female-400/50",
          text: "text-candidate-female-700",
          badge: "bg-candidate-female-500",
          glow: "shadow-candidate-female-500/50",
        };
      case "Prince":
        return {
          gradient: "from-candidate-male-400 via-candidate-male-500 to-candidate-male-600",
          bgGradient: "from-candidate-male-400/15 via-candidate-male-300/8 to-transparent",
          border: "border-candidate-male-300/40",
          text: "text-candidate-male-700",
          badge: "bg-candidate-male-400",
          glow: "shadow-candidate-male-400/30",
        };
      case "Princess":
        return {
          gradient: "from-candidate-female-400 via-candidate-female-500 to-candidate-female-600",
          bgGradient: "from-candidate-female-400/15 via-candidate-female-300/8 to-transparent",
          border: "border-candidate-female-300/40",
          text: "text-candidate-female-700",
          badge: "bg-candidate-female-400",
          glow: "shadow-candidate-female-400/30",
        };
      default:
        return {
          gradient: "from-gray-500 to-gray-600",
          bgGradient: "from-gray-400/10 to-transparent",
          border: "border-gray-300",
          text: "text-gray-700",
          badge: "bg-gray-500",
          glow: "shadow-gray-500/20",
        };
    }
  };

  const displayName = (name: string) => {
    const mainName = name.split("(")[0].trim();
    const suffix = name.includes("(") ? name.substring(name.indexOf("(")) : "";
    return { mainName, suffix };
  };

  // Organize results in the desired order
  const getOrderedResults = () => {
    const king = results.find(r => r.title === "King");
    const queen = results.find(r => r.title === "Queen");
    const prince = results.find(r => r.title === "Prince");
    const princess = results.find(r => r.title === "Princess");
    
    // Large screen order: Prince, King, Queen, Princess
    // Mobile order: King, Queen, Prince, Princess
    return {
      desktop: [prince, king, queen, princess].filter(Boolean) as winnerCandidate[],
      mobile: [king, queen, prince, princess].filter(Boolean) as winnerCandidate[],
    };
  };

  const { desktop: desktopOrder, mobile: mobileOrder } = getOrderedResults();
  const isTopTwo = (title: string) => title === "King" || title === "Queen";

  const renderCard = (candidate: winnerCandidate, index: number, isLarge: boolean) => {
    const config = getTitleConfig(candidate.title);
    const { mainName, suffix } = displayName(candidate.name);
    const topTwo = isTopTwo(candidate.title);

    if (topTwo && isLarge) {
      // Hero cards for King/Queen on large screens
      return (
        <motion.div
          key={candidate.title}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.15,
            ease: [0.16, 1, 0.3, 1]
          }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="group relative"
        >
          <Link href={`/candidate/${candidate.id}`}>
            <div className={`relative overflow-hidden rounded-3xl border-2 ${config.border} bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm shadow-2xl ${config.glow} transition-all duration-500`}>
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative p-6 md:p-8 flex flex-col items-center">
                {/* Large Profile Image */}
                <div className="relative w-40 h-40 md:w-52 md:h-52 mb-5 group/image">
                  {/* Glow ring */}
                  <div className={`absolute inset-0 rounded-full ${config.glow} blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  
                  {/* Image with elegant frame */}
                  <div className={`relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-offset-4 ring-offset-transparent transition-all duration-500 ${
                    config.border.includes('candidate-male') 
                      ? 'ring-candidate-male-300/40 group-hover:ring-candidate-male-400/60' 
                      : 'ring-candidate-female-300/40 group-hover:ring-candidate-female-400/60'
                  }`}>
                    <Image
                      src={candidate.profileImage}
                      alt={`${candidate.title} ${candidate.name}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/image:scale-110"
                      priority
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  {/* Crown Badge - Large */}
                  <motion.div 
                    className={`absolute -top-3 -right-3 ${config.badge} rounded-full p-2.5 md:p-3 shadow-2xl border-[3px] border-white z-10`}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" />
                  </motion.div>

                  {/* Trophy Badge */}
                  {/* <motion.div 
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-full p-2 md:p-2.5 shadow-2xl border-[3px] border-white z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + index * 0.2, type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.3, rotate: 10 }}
                  >
                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" />
                    <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" fill="currentColor" />
                    <Star className="absolute -bottom-1 -left-1 w-2 h-2 text-amber-300 animate-pulse" style={{ animationDelay: '0.3s' }} fill="currentColor" />
                  </motion.div> */}
                </div>

                {/* Title Badge */}
                <motion.div 
                  className={`mb-4 px-5 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white shadow-xl relative overflow-hidden`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  <h2 className="text-base md:text-lg font-medium relative z-10 tracking-wider uppercase">
                    {candidate.title}
                  </h2>
                </motion.div>

                {/* Name */}
                <div className="text-center">
                  <h3 className={`text-xl md:text-2xl font-semibold ${config.text} mb-2 group-hover:scale-105 transition-transform duration-300`}>
                    {mainName}
                  </h3>
                  {suffix && (
                    <span className="text-sm md:text-base text-gray-600 font-medium">
                      {suffix}
                    </span>
                  )}
                </div>

                {/* Decorative stars */}
                <div className="absolute top-4 left-4">
                  <Star className="w-4 h-4 text-yellow-400/60 animate-pulse" fill="currentColor" />
                </div>
                <div className="absolute top-6 right-6">
                  <Star className="w-3 h-3 text-yellow-400/60 animate-pulse" style={{ animationDelay: '0.5s' }} fill="currentColor" />
                </div>
                <div className="absolute bottom-4 left-6">
                  <Star className="w-3 h-3 text-yellow-400/60 animate-pulse" style={{ animationDelay: '1s' }} fill="currentColor" />
                </div>
                <div className="absolute bottom-6 right-4">
                  <Star className="w-4 h-4 text-yellow-400/60 animate-pulse" style={{ animationDelay: '1.5s' }} fill="currentColor" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      );
    } else {
      // Regular cards for Prince/Princess or mobile view
      return (
        <motion.div
          key={candidate.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group relative"
        >
          <Link href={`/candidate/${candidate.id}`}>
            <div className={`relative overflow-hidden rounded-2xl border-2 ${config.border} bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-xl ${config.glow} transition-all duration-300`}>
              {/* Subtle background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative p-6 flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 group/image">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-full ${config.glow} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                  
                  <div className={`relative w-full h-full rounded-full overflow-hidden border-[3px] border-white shadow-xl ring-2 ring-offset-2 ring-offset-transparent transition-all duration-300 ${
                    config.border.includes('candidate-male') 
                      ? 'ring-candidate-male-300/30 group-hover:ring-candidate-male-400/50' 
                      : 'ring-candidate-female-300/30 group-hover:ring-candidate-female-400/50'
                  }`}>
                    <Image
                      src={candidate.profileImage}
                      alt={`${candidate.title} ${candidate.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/image:scale-110"
                      priority={index < 2}
                    />
                  </div>
                  
                  {/* Crown Badge */}
                  <div className={`absolute -top-2 -right-2 ${config.badge} rounded-full p-2 shadow-lg border-2 border-white z-10`}>
                    <Crown className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" />
                  </div>
                </div>

                {/* Title */}
                <div className={`mb-3 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} text-white shadow-md`}>
                  <h2 className="text-sm md:text-base font-medium tracking-wide">
                    {candidate.title}
                  </h2>
                </div>

                {/* Name */}
                <div className="text-center">
                  <h3 className={`text-xl md:text-2xl font-semibold ${config.text} mb-1 group-hover:scale-105 transition-transform duration-300`}>
                    {mainName}
                  </h3>
                  {suffix && (
                    <span className="text-xs md:text-sm text-gray-500">
                      {suffix}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      );
    }
  };

  return (
    <div className="w-full mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Desktop Layout: Prince, King, Queen, Princess (4 columns) */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto justify-center items-center">
        {desktopOrder.map((candidate, index) => {
          const isHero = isTopTwo(candidate.title);
          return (
            <div 
              key={`desktop-${candidate.title}`} 
              className={`${isHero ? 'md:col-span-1' : 'md:col-span-1'} flex items-stretch justify-center items-center`}
            >
              {renderCard(candidate, index, isHero)}
            </div>
          );
        })}
      </div>

      {/* Mobile Layout: King, Queen, Prince, Princess (stacked) */}
      <div className="grid grid-cols-1 md:hidden gap-6 max-w-md mx-auto">
        {mobileOrder.map((candidate, index) => (
          <div key={`mobile-${candidate.title}`}>
            {renderCard(candidate, index, false)}
          </div>
        ))}
      </div>
    </div>
  );
}
