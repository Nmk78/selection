"use client";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import {
  GraduationCap,
  Ruler,
  Scale,
  Calendar,
  Heart,
  Sparkles,
  Vote,
  Loader2,
} from "lucide-react";

interface CandidateProps {
  id: string;
  name: string;
  major: string;
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  intro: string;
  hobbies: string[];
  carouselImages: string[];
  profileImage: string;
}

export default function CandidateDetails({
  id,
  name,
  major,
  age,
  gender,
  height,
  weight,
  intro,
  hobbies,
  carouselImages,
  profileImage,
}: CandidateProps) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  const [voting, setVoting] = useState(false);
  const voteForCandidate = useMutation(api.votes.voteForCandidate);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const candidateId = formData.get("candidateId") as string;
    const secretKey = formData.get("secretKey") as string;

    setVoting(true);
    try {
      const res = await voteForCandidate({
        candidateId: candidateId as Id<"candidates">,
        secretKey,
      });

      toast({
        title: res.success ? "Success" : "Failed",
        description: res.message,
      });
    } catch (error) {
      console.error("Failed to record vote:", error);
      toast({
        title: "Error",
        description: "Something went wrong while voting.",
      });
    } finally {
      setVoting(false);
    }
  };

  const isMale = gender === "male";
  const displayName = name.split("(")[0].trim();
  const nameSuffix = name.includes("(")
    ? name.substring(name.indexOf("("))
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <Card className="w-full bg-gradient-to-br from-white via-candidate-male-50/30 to-candidate-female-50/30 rounded-2xl shadow-2xl border-2 border-candidate-male-100/50 overflow-hidden">
        {/* Header Section with Gradient Background */}
        <div
          className={`relative overflow-hidden ${
            isMale
              ? "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900"
              : "bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600"
            // : "bg-gradient-to-r from-candidate-female-500 via-candidate-female-400 to-candidate-female-500"
          }`}
        >
          <div
            className={`absolute inset-0 opacity-10 ${isMale ? "bg-[url('/grid_light.svg')]" : "bg-[url('/grid.svg')]"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

          <CardContent className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              {/* Profile Image - Portrait */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="relative w-full md:w-80 flex-shrink-0"
              >
                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
                  <Image
                    src={profileImage}
                    alt={`Profile picture of ${displayName}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 hover:scale-110"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Crown badge */}
                {/* <div className="absolute -top-3 -right-3 z-10">
                  <div
                    className={`rounded-full p-3 shadow-xl ${
                      isMale
                        ? "bg-gradient-to-br from-candidate-male-700 to-candidate-male-900"
                        : "bg-gradient-to-br from-candidate-female-600 to-candidate-female-800"
                    }`}
                  >
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div> */}
              </motion.div>

              {/* Info Section */}
              <div className="flex-1 space-y-4 md:space-y-5 text-white">
                {/* Name */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                    {displayName}
                    {nameSuffix && (
                      <span className="text-xl md:text-2xl font-normal ml-2 opacity-90">
                        {nameSuffix}
                      </span>
                    )}
                  </h1>
                </motion.div>

                {/* Major with icon */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <GraduationCap className="w-5 h-5 text-white/90" />
                  <p className="text-lg md:text-xl font-medium text-white/95">
                    {major}
                  </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="grid grid-cols-3 gap-4 pt-2"
                >
                  <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <Calendar className="w-5 h-5 mb-1 text-white/90" />
                    <span className="text-xs text-white/80">Age</span>
                    <span className="text-lg font-bold text-white">{age}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <Ruler className="w-5 h-5 mb-1 text-white/90" />
                    <span className="text-xs text-white/80">Height</span>
                    <span className="text-lg font-bold text-white">
                      {height} cm
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <Scale className="w-5 h-5 mb-1 text-white/90" />
                    <span className="text-xs text-white/80">Weight</span>
                    <span className="text-lg font-bold text-white">
                      {weight} lb
                    </span>
                  </div>
                </motion.div>
                {/* Hobbies Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="space-y-3 hidden md:flex md:flex-col"
                >
                  <div className="flex items-center gap-2">
                    <Heart
                      className={`w-5 h-5 text-white`}
                    />
                    <h3
                      className={`text-xl font-bold text-white`}
                    >
                      Hobbies & Interests
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hobbies.map((hobby, index) => (
                      <Badge
                        key={index}
                        className={`px-3 py-1.5 text-sm font-medium backdrop-blur-sm border ${
                          isMale
                            ? "bg-candidate-male-100/80 text-candidate-male-700 border-candidate-male-200/50 hover:bg-candidate-male-200/80"
                            : "bg-candidate-female-100/80 text-candidate-female-700 border-candidate-female-200/50 hover:bg-candidate-female-200/80"
                        } transition-colors`}
                      >
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Content Section */}
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles
                className={`w-5 h-5 ${
                  isMale ? "text-candidate-male-600" : "text-candidate-female-600"
                }`}
              />
              <h2
                className={`text-2xl font-bold ${
                  isMale
                    ? "bg-gradient-to-r from-candidate-male-600 to-candidate-male-800 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-candidate-female-600 to-candidate-female-800 bg-clip-text text-transparent"
                }`}
              >
                About {displayName.split(" ")[0]}
              </h2>
            </div>
            <div className="relative p-5 rounded-xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/50 backdrop-blur-sm">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {intro}
              </p>
            </div>
          </motion.div>

          {/* Hobbies Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="space-y-3 block md:hidden"
          >
            <div className="flex items-center gap-2">
              <Heart
                className={`w-5 h-5 ${
                  isMale ? "text-candidate-male-600" : "text-candidate-female-600"
                }`}
              />
              <h3
                className={`text-xl font-bold ${
                  isMale
                    ? "bg-gradient-to-r from-candidate-male-600 to-candidate-male-800 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-candidate-female-600 to-candidate-female-800 bg-clip-text text-transparent"
                }`}
              >
                Hobbies & Interests
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, index) => (
                <Badge
                  key={index}
                  className={`px-3 py-1.5 text-sm font-medium backdrop-blur-sm border ${
                    isMale
                      ? "bg-candidate-male-100/80 text-candidate-male-700 border-candidate-male-200/50 hover:bg-candidate-male-200/80"
                      : "bg-candidate-female-100/80 text-candidate-female-700 border-candidate-female-200/50 hover:bg-candidate-female-200/80"
                  } transition-colors`}
                >
                  {hobby}
                </Badge>
              ))}
            </div>
          </motion.div>
        </CardContent>

        {/* Full-body Image Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="w-full px-6 md:px-8 pb-6 md:pb-8"
        >
          <div className="mb-4">
            <h3
              className={`text-xl font-bold ${
                isMale
                  ? "bg-gradient-to-r from-candidate-male-600 to-candidate-male-800 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-candidate-female-600 to-candidate-female-800 bg-clip-text text-transparent"
              }`}
            >
              Gallery
            </h3>
          </div>
          <Carousel
            plugins={[plugin.current]}
            className="w-full mx-auto rounded-xl overflow-hidden"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {carouselImages.map((url, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border-2 border-gray-200/50 hover:border-candidate-male-300/50 transition-all duration-300 hover:shadow-2xl">
                    <Image
                      src={url}
                      alt={`Full-body Image ${index + 1} of ${displayName}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-2 bg-white/80 backdrop-blur-sm hover:bg-white" />
            <CarouselNext className="hidden md:flex -right-12 border-2 bg-white/80 backdrop-blur-sm hover:bg-white" />
          </Carousel>
        </motion.div>

        {/* Vote Section */}
        <CardFooter className="flex justify-center p-6 md:p-8 bg-gradient-to-br from-gray-50/50 to-white border-t border-gray-200/50">
          <Dialog>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className={`relative w-full md:w-auto px-8 py-6 text-lg font-semibold shadow-xl ${
                    isMale
                      ? "bg-gradient-to-r from-candidate-male-600 to-candidate-male-700 hover:from-candidate-male-700 hover:to-candidate-male-800 text-white"
                      : "bg-gradient-to-r from-candidate-female-500 to-candidate-female-600 hover:from-candidate-female-600 hover:to-candidate-female-700 text-white"
                  } transition-all duration-300`}
                  aria-label={`Vote for ${displayName}`}
                >
                  <Vote className="w-5 h-5 mr-2" />
                  Vote for {displayName.split(" ")[0]}
                  <Sparkles className="w-4 h-4 ml-2 absolute -top-1 -right-1 animate-pulse" />
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent
              className={`sm:max-w-[450px] rounded-2xl border-2 ${
                isMale ? "border-candidate-male-200" : "border-candidate-female-200"
              } bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-xl shadow-2xl`}
            >
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isMale
                        ? "bg-candidate-male-100 text-candidate-male-600"
                        : "bg-candidate-female-100 text-candidate-female-600"
                    }`}
                  >
                    <Vote className="w-5 h-5" />
                  </div>
                  <DialogTitle className="text-2xl font-bold">
                    Vote for {displayName}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base text-gray-600">
                  Enter your secret code to submit your vote. This action is
                  irreversible.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5 py-4">
                  {/* Hidden input for candidate ID */}
                  <input type="hidden" name="candidateId" value={id} />

                  {/* Input for secret code */}
                  <div className="space-y-2">
                    <label
                      htmlFor="code"
                      className="text-sm font-medium text-gray-700"
                    >
                      Secret Code
                    </label>
                    <Input
                      id="code"
                      name="secretKey"
                      placeholder="Enter your secret code"
                      className="w-full h-12 text-base border-2 focus:border-candidate-male-400 focus:ring-candidate-male-400 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <Button
                  className={`w-full py-6 text-base font-semibold ${
                    isMale
                      ? "bg-gradient-to-r from-candidate-male-600 to-candidate-male-700 hover:from-candidate-male-700 hover:to-candidate-male-800 text-white"
                      : "bg-gradient-to-r from-candidate-female-500 to-candidate-female-600 hover:from-candidate-female-600 hover:to-candidate-female-700 text-white"
                  } transition-all duration-300 shadow-lg`}
                  type="submit"
                  disabled={voting}
                >
                  {voting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Vote className="w-5 h-5 mr-2" />
                      Submit Vote
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
