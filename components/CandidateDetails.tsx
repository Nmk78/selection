"use client";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState } from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { voteForCandidate } from "@/actions/vote";
import { Candidate } from "@prisma/client";

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
}: Candidate) {
  console.log("🚀 ~ carouselImages:", carouselImages)
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  const [voting, setVoting] = useState(false);
  // Mutation using React Query
  const { mutate: voteCandidate } = useMutation({
    mutationFn: async ({
      candidateId,
      secretKey,
    }: {
      candidateId: string;
      secretKey: string;
    }) => {
      setVoting(true);
      // Ensure voteForCandidate is returning the expected result
      const res = await voteForCandidate(candidateId, secretKey);
      console.log("🚀 ~ res:", res); // Log the response for debugging
      toast({
        title: res.success ? "Succeed" : "Failed",
        description: res.message,
      });
      setVoting(false);
      return res;
    },
    onError: (error) => {
      console.error("Failed to record vote:", error);
      toast({
        title: "Error",
        description: "Something went wrong while voting.",
      });
    },
  });

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the form from submitting the traditional way

    const formData = new FormData(e.target as HTMLFormElement);
    const candidateId = formData.get("candidateId") as string;
    const secretKey = formData.get("secretKey") as string;

    console.log("Form submitting", { candidateId, secretKey });

    // Call the mutation with the gathered data, without using `await`
    voteCandidate({ candidateId, secretKey });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-Cbackground rounded-none shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="w-full md:w-1/2 space-y-4">
            {/* Profile Image */}
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={profileImage}
                alt={`Profile picture of ${name}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 space-y-6">
            {/* Name and Age in one row */}
            <div className="flex items-center justify-between space-x-4">
              <h1
                className={`text-2xl md:text-3xl font-semibold ${
                  gender === "male" ? "text-Cprimary" : "text-Caccent"
                }`}
              >
                {name}
              </h1>
              <p className="text-Cprimary">
                <span className="font-semibold">Age:</span> {age}
              </p>
            </div>

            {/* Major in its own row */}
            <div className="space-y-2">
              <p className="text-Cprimary">
                <span className="font-semibold">Major:</span> {major}
              </p>
            </div>

            {/* Weight and Height in one row */}
            <div className="flex items-center justify-between">
              <p className="text-Cprimary">
                <span className="font-semibold">Height:</span> {height}
              </p>
              <p className="text-Cprimary">
                <span className="font-semibold">Weight:</span> {weight}
              </p>
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-Cprimary mb-2">
                About {name.split(" ")[0]}
              </h2>
              <p className="text-Cprimary text-sm md:text-base">{intro}</p>
            </div>

            {/* Hobbies Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-romantic-Cprimary mb-2">
                Hobbies
              </h2>
              <ul className="list-disc list-inside text-Cprimary text-sm md:text-base">
                {hobbies.map((hobby, index) => (
                  <li key={index}>{hobby}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Full-body Image Carousel */}
      <div className="w-full px-4 md:px-6 pb-4 md:pb-6">
        <Carousel
          plugins={[plugin.current]}
          className="w-full mx-auto rounded-lg overflow-hidden"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {carouselImages.map((url, index) => (
              <CarouselItem
                key={index}
                className=" -pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className=" aspect-portrait relative overflow-hidden">
                  <Image
                    src={url}
                    alt={`Full-body Image ${index + 1} of ${name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className=""
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <CardFooter className="flex justify-center p-4 md:p-6 bg-romantic-Csecondary bg-opacity-30">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-Caccent hover:bg-Caccent/85 text-white w-full md:w-auto"
              aria-label={`Vote for ${name}`}
            >
              Vote for {name}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-Cprimary">
            <DialogHeader>
              <DialogTitle>Vote for {name}</DialogTitle>
              <DialogDescription>
                Submit your vote. Note: This action is irreversible.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 py-4">
                {/* Hidden input for candidate ID */}
                <input type="hidden" name="candidateId" value={id} />

                {/* Input for secret code */}
                <Input
                  id="code"
                  name="secretKey"
                  placeholder="Enter your secret code"
                  className="w-full"
                  required
                />
              </div>
              <Button
                className="bg-Caccent hover:bg-Caccent/90 text-white w-full"
                type="submit"
                disabled={voting}
              >
                {voting ? "Please wait" : "Submit Vote"}
              </Button>
            </form>

            {/* <DialogFooter>
                
              </DialogFooter> */}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
