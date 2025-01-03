// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Slider } from "@/components/ui/slider";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { AlertCircle, Star, StarHalf } from "lucide-react";
// import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
// import Autoplay from "embla-carousel-autoplay";
// import { addRatingsToVotes } from "@/actions/judge";
// import { toast } from "@/hooks/use-toast";
// import { Badge } from "./ui/badge";
// import { Alert, AlertDescription } from "./ui/alert";

// interface Candidate {
//   id: string;
//   name: string;
//   intro: string;
//   gender: "male" | "female";
//   major: string;
//   profileImage: string;
//   carouselImages: string[];
//   height: number;
//   age: number;
//   weight: number;
//   hobbies: string[];
// }

// interface JudgeVotingFormProps {
//   candidates: Candidate[];
// }

// export default function JudgeVoting({ candidates }: JudgeVotingFormProps) {
//   const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
//   const searchParams = useSearchParams();

//   const [judgeCode, setJudgeCode] = useState<string | null>(null);
//   const [loading, seLoading] = useState<boolean>(false);
//   const [ratings, setRatings] = useState<{ [key: string]: number }>(
//     Object.fromEntries(candidates.map((c) => [c.id, 0]))
//   );

//   useEffect(() => {
//     const secretFromQuery = searchParams.get("secret");
//     if (secretFromQuery) {
//       setJudgeCode(secretFromQuery);
//     }
//   }, [searchParams]);

//   function StarRating({ rating }: { rating: number }) {
//     const fullStars = Math.floor(rating / 2);
//     const hasHalfStar = rating % 2 >= 1;

//     return (
//       <div className="flex">
//         {[...Array(5)].map((_, index) => {
//           if (index < fullStars) {
//             return (
//               <Star
//                 key={index}
//                 className="w-5 h-5 text-yellow-400 fill-yellow-400"
//               />
//             );
//           } else if (index === fullStars && hasHalfStar) {
//             return (
//               <StarHalf
//                 key={index}
//                 className="w-5 h-5 text-yellow-400 fill-yellow-400"
//               />
//             );
//           } else {
//             return <Star key={index} className="w-5 h-5 text-gray-300" />;
//           }
//         })}
//       </div>
//     );
//   }

//   // const handleRatingChange = useRef(
//   //   debounce((id: string, value: number) => {
//   //     setRatings((prevRatings) => {
//   //       if (prevRatings[id] === value) {
//   //         return prevRatings; // No update if value is the same
//   //       }
//   //       return {
//   //         ...prevRatings,
//   //         [id]: value,
//   //       };
//   //     });
//   //   }, 100) // 300ms delay
//   // ).current;
//   const handleRatingChange = (id: string, value: number) => {
//     setRatings((prevRatings) => {
//       if (prevRatings[id] === value) {
//         return prevRatings; // No update if value is the same
//       }
//       return {
//         ...prevRatings,
//         [id]: value,
//       };
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     seLoading(true);
//     if (!judgeCode) {
//       seLoading(false);
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>Please enter your judge code! </AlertDescription>
//       </Alert>;
//       return;
//     }
//     if (Object.values(ratings).some((rating) => rating === 0)) {
//       seLoading(false);
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertDescription>Please rate all candidates! </AlertDescription>
//       </Alert>;
//       return;
//     }
//     console.log("Judge Code:", judgeCode);
//     console.log("Ratings:", ratings);
//     const roundedRatings = Object.fromEntries(
//       Object.entries(ratings).map(([key, value]) => [key, Math.round(value)])
//     );

//     console.log("Rounded Ratings:", roundedRatings);
//     try {
//       const res = await addRatingsToVotes(roundedRatings, judgeCode);
//       console.log("🚀 ~ handleSubmit ~ res:", res);
//       toast({
//         title: res.success ? "Succeed" : "Failed",
//         description: res.message,
//       });
//       seLoading(false);
//     } catch (error) {
//       console.log("🚀 ~ handleSubmit ~ error:", error);
//       seLoading(false);
//       toast({
//         title: "Error",
//         description: "Something went wrong! Please try again.",
//       });
//     }

//     // Submit to backend
//   };

//   useEffect(() => {
//     setRatings(Object.fromEntries(candidates.map((c) => [c.id, 0])));
//   }, [candidates]);

//   candidates = useMemo(
//     () => candidates.sort(() => Math.random() - 0.5),
//     [candidates]
//   );

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
//       {candidates.map((candidate, index) => (
//         <motion.div
//           key={candidate.id}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: index * 0.1 }}
//           className="w-full"
//         >
//           <Card className="w-full p-4 md:p-6">
//             <CardContent className="flex flex-col md:flex-row gap-6 p-0">
//               {/* Carousel Section */}
//               <div className="w-full md:w-1/2 flex-grow">
//                 <Carousel
//                   plugins={[plugin.current]}
//                   onMouseEnter={plugin.current.stop}
//                   onMouseLeave={plugin.current.reset}
//                   className="w-full max-w-full mx-auto"
//                 >
//                   <CarouselContent className="flex gap-2">
//                     {/* Carousel Images */}
//                     {candidate.carouselImages.map((image, idx) => (
//                       <CarouselItem
//                         key={idx}
//                         className="basis-full md:basis-1/2 lg:basis-1/2"
//                       >
//                         <div className="aspect-portrait w-full relative">
//                           <Image
//                             src={image}
//                             alt={`${candidate.name}'s image ${idx + 1}`}
//                             fill
//                             className="object-cover rounded-md"
//                           />
//                         </div>
//                       </CarouselItem>
//                     ))}
//                   </CarouselContent>
//                 </Carousel>
//               </div>

//               {/* Candidate Details Section */}
//               <div className="w-full md:w-1/2 space-y-4">
//                 <div className="flex justify-between">
//                   <h3 className="text-xl md:text-2xl font-bold text-gray-800">
//                     {candidate.name}
//                   </h3>
//                   <p className="text-sm md:text-lg text-gray-600">
//                     {candidate.major}
//                   </p>
//                 </div>
//                 <p className="text-sm text-gray-600">{candidate.intro}</p>

//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <p>
//                     <strong>Age:</strong> {candidate.age}
//                   </p>
//                   <p>
//                     <strong>Gender:</strong> {candidate.gender}
//                   </p>
//                   <p>
//                     <strong>Height:</strong> {candidate.height} cm
//                   </p>
//                   <p>
//                     <strong>Weight:</strong> {candidate.weight} kg
//                   </p>
//                 </div>

//                 <div>
//                   <strong>Hobbies:</strong>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {candidate.hobbies.map((hobby, idx) => (
//                       <Badge key={idx} variant="secondary">
//                         {hobby}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Rating and Slider */}
//                 <div className="space-y-4">
//                   <div className="flex justify-end items-center">
//                     <StarRating rating={ratings[candidate.id]} />
//                   </div>
//                   <Slider
//                     min={0}
//                     max={10}
//                     step={0.1}
//                     value={[ratings[candidate.id]]}
//                     onValueChange={(value) => {
//                       if (ratings[candidate.id] !== value[0]) {
//                         handleRatingChange(candidate.id, value[0]);
//                       }
//                     }}
//                     className="w-full"
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       ))}

//       <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
//         <CardContent className="p-6">
//           <Label
//             htmlFor="judgeCode"
//             className="text-lg font-semibold text-gray-700"
//           >
//             Judge Code
//           </Label>
//           <Input
//             type="text"
//             id="judgeCode"
//             value={judgeCode ?? ""}
//             onChange={(e) => setJudgeCode(e.target.value)}
//             required
//             className="mt-2 w-full text-lg"
//             placeholder="Enter your special code"
//           />
//         </CardContent>
//       </Card>

//       <Button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-primary hover:bg-primary-dark text-white text-lg font-bold py-3 rounded-xl transition-colors duration-300"
//       >
//         {loading ? "Processing" : "Rate"}
//       </Button>
//     </form>
//   );
// }
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { addRatingsToVotes } from "@/actions/judge";
import { toast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
// import { Alert, AlertDescription } from "./ui/alert";

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
  const [ratings, setRatings] = useState<{
    [key: string]: { dressing: number; performance: number; QA: number };
  }>(
    Object.fromEntries(
      candidates.map((c) => [c.id, { dressing: 0, performance: 0, QA: 0 }])
    )
  );

  useEffect(() => {
    const secretFromQuery = searchParams.get("secret");
    if (secretFromQuery) {
      setJudgeCode(secretFromQuery);
    }
  }, [searchParams]);

  function StarRating({
    rating,
    category,
  }: {
    rating: number;
    category: string;
  }) {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;

    return (
      <div className="w-full flex items-center justify-between">
        <span className="mr-2 font-semibold">{category}:</span>
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
      </div>
    );
  }

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
    seLoading(true);
    if (!judgeCode) {
      seLoading(false);
      toast({
        title: "Error",
        description: "Please enter your judge code!",
        variant: "destructive",
      });
      return;
    }
    if (
      Object.values(ratings).some((candidateRatings) =>
        Object.values(candidateRatings).some((rating) => rating === 0)
      )
    ) {
      seLoading(false);
      toast({
        title: "Error",
        description: "Please rate all categories for all candidates!",
        variant: "destructive",
      });
      return;
    }
    console.log("Judge Code:", judgeCode);
    console.log("Ratings:", ratings);
    const roundedRatings = Object.fromEntries(
      Object.entries(ratings).map(([key, value]) => [
        key,
        Math.round(value.dressing + value.performance + value.QA),
        // {
        //   dressing: Math.round(value.dressing),
        //   performance: Math.round(value.performance),
        //   QA: Math.round(value.QA),
        // },
      ])
    );
    //     const roundedRatings = Object.fromEntries(
    //       Object.entries(ratings).map(([key, value]) => [key, Math.round(value)])
    //     );

    console.log("Rounded Ratings:", roundedRatings);
    try {
      const res = await addRatingsToVotes(roundedRatings, judgeCode);
      console.log("🚀 ~ handleSubmit ~ res:", res);
      toast({
        title: res.success ? "Succeed" : "Failed",
        description: res.message,
      });
      seLoading(false);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      seLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
      });
    }

    // Submit to backend
  };

  useEffect(() => {
    setRatings(
      Object.fromEntries(
        candidates.map((c) => [c.id, { dressing: 0, performance: 0, QA: 0 }])
      )
    );
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
          className="w-full"
        >
          <Card className="w-full p-4 md:p-6">
            <CardContent className="flex flex-col md:flex-row gap-6 p-0">
              {/* Carousel Section */}
              <div className="w-full md:w-1/2 flex-grow">
                <Carousel
                  plugins={[plugin.current]}
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                  className="w-full max-w-full mx-auto"
                >
                  <CarouselContent className="flex gap-2">
                    {/* Carousel Images */}
                    {candidate.carouselImages.map((image, idx) => (
                      <CarouselItem key={idx} className="basis-full ">
                        <div className="aspect-portrait w-full relative">
                          <Image
                            src={image}
                            alt={`${candidate.name}'s image ${idx + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>

              {/* Candidate Details Section */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                    {candidate.name}
                  </h3>
                  {/* <p className="text-sm md:text-lg text-gray-600">
                    {candidate.major}
                  </p> */}
                </div>
                <p className="text-sm text-gray-600">{candidate.intro}</p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <strong>Age:</strong> {candidate.age}
                  </p>
                  <p>
                    <strong>Major:</strong> {candidate.major}
                  </p>
                  <p>
                    <strong>Height:</strong> {candidate.height} cm
                  </p>
                  <p>
                    <strong>Weight:</strong> {candidate.weight} kg
                  </p>
                </div>

                <div>
                  <strong>Hobbies:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {candidate.hobbies.map((hobby, idx) => (
                      <Badge key={idx} variant="secondary">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Rating and Sliders */}
                <div className="space-y-4">
                  {["dressing", "performance", "QA"].map((category) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <StarRating
                          rating={
                            ratings[candidate.id][
                              category as keyof (typeof ratings)[typeof candidate.id]
                            ]
                          }
                          category={
                            category === "QA"
                              ? "Q&A"
                              : category.charAt(0).toUpperCase() +
                                category.slice(1)
                          }
                        />
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        value={[
                          ratings[candidate.id][
                            category as keyof (typeof ratings)[typeof candidate.id]
                          ],
                        ]}
                        onValueChange={(value) =>
                          handleRatingChange(
                            candidate.id,
                            category as "dressing" | "performance" | "QA",
                            value[0]
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  ))}
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
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white text-lg font-bold py-3 rounded-xl transition-colors duration-300"
      >
        {loading ? "Processing" : "Rate"}
      </Button>
    </form>
  );
}
