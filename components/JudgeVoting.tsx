"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { Candidate } from "@/types/types";
import { motion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface JudgeVotingFormProps {
  candidates: Candidate[];
}

export default function JudgeVoting({ candidates }: JudgeVotingFormProps) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  const [judgeCode, setJudgeCode] = useState<any | null>(null);
  const [ratings, setRatings] = useState<{ [key: string]: number }>(
    Object.fromEntries(candidates.map((c) => [c.id, 0]))
  );

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

  const handleRatingChange = (candidateId: string, value: number[]) => {
    setRatings((prev) => ({ ...prev, [candidateId]: value[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Judge Code:", judgeCode);
    console.log("Ratings:", ratings);
    // Here you would typically send this data to your backend
  };

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
                    className="w-full mx-auto rounded-lg h-auto md:h-auto" // Adjust height for larger screens
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent className="w-full h-full">
                      {candidate.imageUrls.map((url, index) => (
                        <CarouselItem
                          className="mx-auto md:basis-1/2"
                          key={index}
                        >
                          <div className="w-full h-full mx-auto relative aspect-potriate">
                            <Image
                              src={url}
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
                  <h3 className="text-2xl font-bold text-gray-800">
                    {candidate.name}
                  </h3>
                  <p className="text-lg text-gray-600">{candidate.major}</p>
                  <p className="text-gray-600">{candidate.intro}</p>
                  <div className="space-y-4">
                    <div className="flex justify-end items-center">
                      <StarRating rating={ratings[candidate.id]} />
                      {/* <span className="text-lg font-semibold text-gray-700">
                        {ratings[candidate.id].toFixed(1)}
                      </span> */}
                    </div>
                    <Slider
                      min={0}
                      max={10}
                      step={0.1}
                      value={[ratings[candidate.id]]}
                      onValueChange={(value) =>
                        handleRatingChange(candidate.id, value)
                      }
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
            value={judgeCode}
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
        Submit Votes
      </Button>
    </form>
  );
}
