"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, StarHalf, GraduationCap, Ruler, Scale, Calendar, Heart, Sparkles, Loader2, Gavel, Home } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";

interface Candidate {
  id: string;
  name: string;
  intro: string;
  gender: "male" | "female";
  major: string;
  profileImage: string;
  carouselImages: string[];
  height: number;
  age: number;
  weight: number;
  hobbies: string[];
}

interface JudgeVotingFormProps {
  candidates: Candidate[];
}

function CandidateCardWithCarousel({ 
  candidate, 
  index, 
  ratings, 
  handleRatingChange 
}: { 
  candidate: Candidate; 
  index: number;
  ratings: { [key: string]: { dressing: number; performance: number; QA: number } };
  handleRatingChange: (id: string, category: "dressing" | "performance" | "QA", value: number) => void;
}) {
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }));
  const isMale = candidate.gender === "male";
  const totalRating = (
    (ratings[candidate.id]?.dressing ?? 0) +
    (ratings[candidate.id]?.performance ?? 0) +
    (ratings[candidate.id]?.QA ?? 0)
  ).toFixed(1);

  function StarRating({
    rating,
    category,
    isMale,
  }: {
    rating: number;
    category: string;
    isMale: boolean;
  }) {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    const displayRating = rating.toFixed(1);

    return (
      <div className="w-full flex items-center justify-between">
        <span className={`font-semibold text-sm ${
          isMale ? "text-candidate-male-700" : "text-candidate-female-700"
        }`}>
          {category}:
        </span>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              if (index < fullStars) {
                return (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      isMale 
                        ? "text-candidate-male-500 fill-candidate-male-500" 
                        : "text-candidate-female-500 fill-candidate-female-500"
                    }`}
                  />
                );
              } else if (index === fullStars && hasHalfStar) {
                return (
                  <StarHalf
                    key={index}
                    className={`w-4 h-4 ${
                      isMale 
                        ? "text-candidate-male-500 fill-candidate-male-500" 
                        : "text-candidate-female-500 fill-candidate-female-500"
                    }`}
                  />
                );
              } else {
                return <Star key={index} className="w-4 h-4 text-gray-300" />;
              }
            })}
          </div>
          <span className={`text-sm font-bold min-w-[3rem] text-right ${
            isMale ? "text-candidate-male-600" : "text-candidate-female-600"
          }`}>
            {displayRating}/10
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={candidate.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full"
    >
      <Card className={`w-full rounded-2xl shadow-xl border-2 pb-3 md:pb-6 overflow-hidden ${
        isMale 
          ? "bg-gradient-to-br from-candidate-male-50/50 to-white border-candidate-male-200/50" 
          : "bg-gradient-to-br from-candidate-female-50/50 to-white border-candidate-female-200/50"
      }`}>
        <CardContent className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
          {/* Carousel Section */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <Carousel
              plugins={[plugin.current]}
              className="w-full rounded-xl overflow-hidden"
            >
              <CarouselContent>
                {candidate.carouselImages.map((image, idx) => (
                  <CarouselItem key={idx} className="basis-full">
                    <div className="aspect-[3/4] w-full relative rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={image}
                        alt={`${candidate.name}'s image ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>

          {/* Candidate Details Section */}
          <div className="w-full md:w-1/2 space-y-5 flex flex-col">
            {/* Total Rating */}
            <div className={`flex items-center justify-between gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full ${
              isMale ? "bg-candidate-male-50/50" : "bg-candidate-female-50/50"
            }`}>
              <span className={`text-xl md:text-2xl font-bold ${
                isMale ? "text-candidate-male-700" : "text-candidate-female-700"
              }`}>{candidate.name}</span>
              <span className={`font-bold text-sm md:text-base ${
                isMale ? "text-candidate-male-700" : "text-candidate-female-700"
              }`}>
                Total: {totalRating}/30
              </span>
            </div>
            {/* Intro */}
            <div className="space-y-2">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                {candidate.intro}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`flex items-center gap-2 p-3 rounded-xl ${
                isMale ? "bg-candidate-male-50" : "bg-candidate-female-50"
              }`}>
                <Calendar className={`w-4 h-4 ${isMale ? "text-candidate-male-600" : "text-candidate-female-600"}`} />
                <div>
                  <p className="text-xs text-gray-600">Age</p>
                  <p className={`font-bold ${isMale ? "text-candidate-male-700" : "text-candidate-female-700"}`}>
                    {candidate.age}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-xl ${
                isMale ? "bg-candidate-male-50" : "bg-candidate-female-50"
              }`}>
                <GraduationCap className={`w-4 h-4 ${isMale ? "text-candidate-male-600" : "text-candidate-female-600"}`} />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600">Major</p>
                  <p className={`font-bold truncate ${isMale ? "text-candidate-male-700" : "text-candidate-female-700"}`}>
                    {candidate.major}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-xl ${
                isMale ? "bg-candidate-male-50" : "bg-candidate-female-50"
              }`}>
                <Ruler className={`w-4 h-4 ${isMale ? "text-candidate-male-600" : "text-candidate-female-600"}`} />
                <div>
                  <p className="text-xs text-gray-600">Height</p>
                  <p className={`font-bold ${isMale ? "text-candidate-male-700" : "text-candidate-female-700"}`}>
                    {candidate.height} cm
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-xl ${
                isMale ? "bg-candidate-male-50" : "bg-candidate-female-50"
              }`}>
                <Scale className={`w-4 h-4 ${isMale ? "text-candidate-male-600" : "text-candidate-female-600"}`} />
                <div>
                  <p className="text-xs text-gray-600">Weight</p>
                  <p className={`font-bold ${isMale ? "text-candidate-male-700" : "text-candidate-female-700"}`}>
                    {candidate.weight} kg
                  </p>
                </div>
              </div>
            </div>

            {/* Hobbies */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className={`w-4 h-4 ${isMale ? "text-candidate-male-600" : "text-candidate-female-600"}`} />
                <strong className={`text-sm ${isMale ? "text-candidate-male-700" : "text-candidate-female-700"}`}>
                  Hobbies:
                </strong>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.hobbies.map((hobby, idx) => (
                  <Badge
                    key={idx}
                    className={`text-xs ${
                      isMale
                        ? "bg-candidate-male-100 text-candidate-male-700 border-candidate-male-200"
                        : "bg-candidate-female-100 text-candidate-female-700 border-candidate-female-200"
                    }`}
                  >
                    {hobby}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rating and Sliders */}
            <div className="space-y-4 pt-2 border-t border-gray-200">
              <h4 className={`font-bold text-sm mb-3 ${
                isMale ? "text-candidate-male-700" : "text-candidate-female-700"
              }`}>
                Ratings (1-10 scale)
              </h4>
              {["dressing", "performance", "QA"].map((category) => (
                <div key={category} className="space-y-2">
                  <StarRating
                    rating={
                      ratings[candidate.id]?.[
                        category as keyof (typeof ratings)[typeof candidate.id]
                      ] ?? 0
                    }
                    category={
                      category === "QA"
                        ? "Q&A"
                        : category.charAt(0).toUpperCase() +
                          category.slice(1)
                    }
                    isMale={isMale}
                  />
                  <Slider
                    min={1}
                    max={10}
                    step={0.1}
                    color={isMale ? "male" : "female"}
                    value={[
                      ratings[candidate.id]?.[
                        category as keyof (typeof ratings)[typeof candidate.id]
                      ] ?? 0,
                    ]}
                    onValueChange={(value) =>
                      handleRatingChange(
                        candidate.id,
                        category as "dressing" | "performance" | "QA",
                        value[0]
                      )
                    }
                    className={`w-full ${
                      isMale ? "[&_.slider-thumb]:bg-candidate-male-600" : "[&_.slider-thumb]:bg-candidate-female-600"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function JudgeVoting({ candidates }: JudgeVotingFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [judgeCode, setJudgeCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [ratings, setRatings] = useState<{
    [key: string]: { dressing: number; performance: number; QA: number };
  }>(
    Object.fromEntries(
      candidates.map((c) => [c.id, { dressing: 0, performance: 0, QA: 0 }])
    )
  );

  const addRatings = useMutation(api.votes.addRatings);

  useEffect(() => {
    const secretFromQuery = searchParams.get("secret");
    if (secretFromQuery) {
      setJudgeCode(secretFromQuery);
    }
  }, [searchParams]);

  const handleRatingChange = (
    id: string,
    category: "dressing" | "performance" | "QA",
    value: number
  ) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [id]: {
        ...prevRatings[id],
        [category]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!judgeCode) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Please enter your judge code!",
        variant: "destructive",
      });
      return;
    }

    // Count all categories across all candidates that have a rating of 0
    const unRatedCategoriesCount = Object.values(ratings).reduce((acc, candidateRatings) => {
      return acc + Object.values(candidateRatings).filter((rating) => rating === 0).length;
    }, 0);
    console.log("🚀 ~ handleSubmit ~ unRatedCategoriesCount:", unRatedCategoriesCount)

    if (unRatedCategoriesCount > 5) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Please rate all categories for all candidates!",
        variant: "destructive",
      });
      
      return;
    }

    const ratingsArray = Object.entries(ratings).map(([candidateId, value]) => ({
      candidateId: candidateId as Id<"candidates">,
      rating: Math.round(value.dressing + value.performance + value.QA),
    }));

    try {
      const res = await addRatings({
        ratings: ratingsArray,
        secretKey: judgeCode,
      });

      if (res.success) {
        setShowSuccessDialog(true);
      } else {
        toast({
          title: "Failed",
          description: res.message,
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("handleSubmit error:", error);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    setRatings(
      Object.fromEntries(
        candidates.map((c) => [c.id, { dressing: 0, performance: 0, QA: 0 }])
      )
    );
  }, [candidates]);

  const shuffledCandidates = useMemo(
    () => [...candidates].sort(() => Math.random() - 0.5),
    [candidates]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 max-w-6xl mx-auto p-4 md:p-6">
      {shuffledCandidates.map((candidate, index) => (
        <CandidateCardWithCarousel
          key={candidate.id}
          candidate={candidate}
          index={index}
          ratings={ratings}
          handleRatingChange={handleRatingChange}
        />
      ))}

      {/* Judge Code Input */}
      <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-xl border-2 border-gray-200/50 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-white">
            <Gavel className="w-5 h-5 md:w-6 md:h-6" />
            <span>Judge Code</span>
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Label
            htmlFor="judgeCode"
            className="text-base md:text-lg font-semibold text-gray-700 mb-3 block"
          >
            Enter Your Judge Code
          </Label>
          <Input
            type="text"
            id="judgeCode"
            value={judgeCode ?? ""}
            onChange={(e) => setJudgeCode(e.target.value)}
            required
            className="w-full text-base md:text-lg h-12 border-2 focus:border-candidate-male-400 focus:ring-candidate-male-400 rounded-lg"
            placeholder="Enter your special judge code"
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 hover:from-candidate-male-700 hover:via-candidate-female-600 hover:to-candidate-male-700 text-white text-lg font-bold py-6 rounded-xl transition-all duration-300 shadow-xl"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Ratings...
            </>
          ) : (
            <>
              <Gavel className="w-5 h-5 mr-2" />
              Submit All Ratings
            </>
          )}
        </Button>
      </motion.div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-green-600" />
              Ratings Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Your ratings have been recorded. Would you like to go to the home page?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                setLoading(false);
              }}
              className="flex-1 sm:flex-initial"
            >
              Stay Here
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                setLoading(false);
                router.push("/");
              }}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 hover:from-candidate-male-700 hover:via-candidate-female-600 hover:to-candidate-male-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
