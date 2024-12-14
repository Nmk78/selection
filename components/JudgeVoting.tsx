"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import debounce from "lodash/debounce";
import { addRatingsToVotes } from "@/actions/judge";
import { toast } from "@/hooks/use-toast";

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

export default function JudgeVoting({ candidates }: JudgeVotingFormProps) {
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
  const searchParams = useSearchParams();

  const [judgeCode, setJudgeCode] = useState<string | null>(null);
  const [loading, seLoading] = useState<boolean>(false);
  const [ratings, setRatings] = useState<{ [key: string]: number }>(
    Object.fromEntries(candidates.map((c) => [c.id, 0]))
  );

  useEffect(() => {
    const secretFromQuery = searchParams.get("secret");
    if (secretFromQuery) {
      setJudgeCode(secretFromQuery);
    }
  }, [searchParams]);

  function StarRating({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;

    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                className="w-5 h-5 text-yellow-400 fill-yellow-400"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <StarHalf
                key={index}
                className="w-5 h-5 text-yellow-400 fill-yellow-400"
              />
            );
          } else {
            return <Star key={index} className="w-5 h-5 text-gray-300" />;
          }
        })}
      </div>
    );
  }

  // const handleRatingChange = useRef(
  //   debounce((id: string, value: number) => {
  //     setRatings((prevRatings) => {
  //       if (prevRatings[id] === value) {
  //         return prevRatings; // No update if value is the same
  //       }
  //       return {
  //         ...prevRatings,
  //         [id]: value,
  //       };
  //     });
  //   }, 100) // 300ms delay
  // ).current;
  const handleRatingChange = (id: string, value: number) => {
    setRatings((prevRatings) => {
      if (prevRatings[id] === value) {
        return prevRatings; // No update if value is the same
      }
      return {
        ...prevRatings,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    seLoading(true);
    if (!judgeCode) {
      seLoading(false);
      alert("Please enter your judge code!");
      return;
    }
    if (Object.values(ratings).some((rating) => rating === 0)) {
      seLoading(false);
      alert("Please rate all candidates!");
      return;
    }
    console.log("Judge Code:", judgeCode);
    console.log("Ratings:", ratings);
    try {
      const res = await addRatingsToVotes(ratings, judgeCode);
      console.log("🚀 ~ handleSubmit ~ res:", res);
      toast({
        title: res.success ? "Succeed" : "Failed",
        description: res.message,
      });
      seLoading(false);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }

    // Submit to backend
  };

  useEffect(() => {
    setRatings(Object.fromEntries(candidates.map((c) => [c.id, 0])));
  }, [candidates]);

  candidates = useMemo(
    () => candidates.sort(() => Math.random() - 0.5),
    [candidates]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
      {candidates.map((candidate, index) => (
        <motion.div
          key={candidate.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-2 py-6 pb-8 md:p-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-3/5 h-auto md:h-auto">
                  <Carousel
                    plugins={[plugin.current]}
                    className="w-full mx-auto rounded-lg h-auto md:h-auto"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent className="w-full h-full">
                      {candidate.carouselImages.map((url, index) => (
                        <CarouselItem
                          className="mx-auto md:basis-1/2"
                          key={index}
                        >
                          <div className="w-full h-full mx-auto relative aspect-potriate">
                            <Image
                              src={url}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              alt={`Full-body Image ${index + 1} of ${name}`}
                              fill
                              style={{ objectFit: "cover" }}
                              className="rounded-lg mx-auto"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
                <div className="w-full md:w-1/2 lg:w-3/5 space-y-3 px-4">
                {/* TODO display candidate data */}
                  <h3 className="text-2xl font-bold text-gray-800">
                    {candidate.name}
                  </h3>
                  <p className="text-lg text-gray-600">{candidate.major}</p>
                  <p className="text-gray-600">{candidate.intro}</p>
                  <div className="space-y-4">
                    <div className="flex justify-end items-center">
                      <StarRating rating={ratings[candidate.id]} />
                    </div>
                    {/* <Slider
                      min={0}
                      max={10}
                      step={0.1}
                      value={[ratings[candidate.id]]}
                      onValueChange={(value) =>
                        handleRatingChange(candidate.id, value)
                      }
                      className="w-full"
                    /> */}
                    <Slider
                      min={0}
                      max={10}
                      step={0.1}
                      value={[ratings[candidate.id]]} // Controlled value
                      onValueChange={(value) => {
                        if (ratings[candidate.id] !== value[0]) {
                          handleRatingChange(candidate.id, value[0]);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <Label
            htmlFor="judgeCode"
            className="text-lg font-semibold text-gray-700"
          >
            Judge Code
          </Label>
          <Input
            type="text"
            id="judgeCode"
            value={judgeCode ?? ""}
            onChange={(e) => setJudgeCode(e.target.value)}
            required
            className="mt-2 w-full text-lg"
            placeholder="Enter your special code"
          />
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark text-white text-lg font-bold py-3 rounded-xl transition-colors duration-300"
      >
        {loading ? "Processing" : "Rate"}
      </Button>
    </form>
  );
}
