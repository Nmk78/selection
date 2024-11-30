"use client";
import Image from "next/image";
import { Heart } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CandidateDetailProps {
  id: string;
  name: string;
  major: string;
  height: string;
  weight: string;
  intro: string;
  hobbies: string[];
  imageUrls: string[];
  profilePic: string;
  votes: number;
}

export default function CandidateDetails({
  id,
  name,
  major,
  height,
  weight,
  intro,
  hobbies,
  imageUrls,
  profilePic,
  votes,
}: CandidateDetailProps) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <Card className="w-full max-w-4xl flex flex-col mx-auto bg-Cbackground rounded-none">
      <CardContent className="p-4 w-full flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="w-full flex flex-col justify-center md:w-1/2 space-y-4">
            {/* Profile Image */}
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={profilePic}
                alt={`Profile picture of ${name}`}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold text-romantic-Cprimary">
              {name}
            </h1>
            <p className="text-romantic-text">
              <span className="font-semibold">Major:</span> {major}
            </p>
            <p className="text-romantic-text">
              <span className="font-semibold">Height:</span> {height}
            </p>
            <p className="text-romantic-text">
              <span className="font-semibold">Weight:</span> {weight}
            </p>
            <div>
              <h2 className="text-xl font-semibold text-romantic-Cprimary">
                About {name.split(" ")[0]}
              </h2>
              <p className="text-romantic-text">{intro}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-romantic-Cprimary">
                Hobbies
              </h2>
              <ul className="list-disc list-inside text-romantic-text">
                {hobbies.map((hobby, index) => (
                  <li key={index}>{hobby}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Full-body Image Carousel */}
      {/* <div className="p-0"> */}
      {/* <Carousel
        plugins={[plugin.current]}
        className="w-full h-[75vh] mx-auto rounded-lg"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="w-full h-full">
          {imageUrls.map((url, index) => (
            <CarouselItem className="mx-auto" key={index}>
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
      </Carousel> */}
      <Carousel
        plugins={[plugin.current]}
        className="w-full mx-auto rounded-lg h-[75vh] md:h-auto" // Adjust height for larger screens
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="w-full h-full">
          {imageUrls.map((url, index) => (
            <CarouselItem className="mx-auto md:basis-1/2" key={index}>
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

      {/* </div> */}

      <CardFooter className="flex flex-col justify-between items-center p-6 bg-romantic-Csecondary bg-opacity-30">
        <div className="flex items-center gap-4">
          <Heart className="text-romantic-Caccent w-6 h-6" />
          <span className="text-romantic-text font-semibold text-lg">
            {votes} votes
          </span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-Caccent hover:bg-Caccent/85 text-white mt-4"
              aria-label={`Vote for ${name}`}
            >
              Vote for {name.split(" ")[0]}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-Cprimary">
            <DialogHeader>
              <DialogTitle>Vote</DialogTitle>
              {/* <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription> */}
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Input
                id="code"
                placeholder="Secret Code"
                // defaultValue="Pedro Duarte"
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button className="bg-Caccent hover:bg-Caccent/90 text-white" type="submit">Vote</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
