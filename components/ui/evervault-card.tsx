"use client";
import { useMotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const EvervaultCard = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  let path = usePathname();

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    let str = generateRandomString(10000);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(10000);
    setRandomString(str);
  }

  return (
    <div
      className={cn(
        "p-0.5 bg-transparent transition-all duration-700 aspect-auto flex items-center justify-center w-full h-full relative",
        className
      )}
    >
      <div
        onMouseMove={onMouseMove}
        className="group/card relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-transparent"
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          randomString={randomString}
        />
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-44 w-44 flex items-center justify-center text-white font-bold text-4xl rounded-full">
            {/* Blurred Background Layer */}
            <div className="absolute inset-0 bg-white/[0.5] dark:bg-black/[0.5] blur-sm rounded-full" />

            {/* Main Content */}
            <span className="z-20 dark:text-white text-red-500">{text}</span>

            {/* Additional Message */}
          </div>
        </div>
        {path === "/auth/signup" && (
          <span className=" text-nowrap mt-5 text-sm text-center w-full text-red-500">
            Signing up isn't allowed! Contact{" "}
            <a
              href="mailto:naymyokhant78@gmail.com"
              className="underline hover:text-red-700"
            >
              naymyokhant78@gmail.com
            </a>{" "}
            or{" "}
            <a href="tel:09459133418" className="underline hover:text-red-700">
              09459133418
            </a>{" "}
            for an invitation link.
          </span>
        )}
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString }: any) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div id="cardPattern" className="pointer-events-none text-wrap">
      <div className="absolute inset-0 rounded-none text-wrap [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
      <motion.div
        className="absolute inset-0 rounded-none text-warp bg-gradient-to-r from-green-500 to-blue-700 opacity-0  group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-none text-wrap opacity-0 mix-blend-overlay  group-hover/card:opacity-100"
        style={style}
      >
        {/* <p className="absolute inset-x-0 text-sm text-wrap w-full h-full break-words whitespace-pre-wrap text-gradient-1 font-mono font-bold transition duration-500"> */}
        <p
          className="absolute inset-x-0 w-full h-full break-all text-gradient-1 font-mono font-bold transition duration-500"
          style={{ lineHeight: "1.5" }}
        >
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const characters = "Polytechnic University Myeik Fresher Welcome";
// "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += " " + characters;
  }
  return result;
};
//export const generateRandomString = (length: number) => {
//   let result = "";
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// };

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
