"use client";

import { useEffect, useState, useRef } from "react";
import { useNextStep } from "nextstepjs";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tour } from "nextstepjs";

const TUTORIAL_STORAGE_KEY = "voting-tutorial-completed";
const TUTORIAL_STEPS_KEY = "voting-tutorial-steps-completed";
const TUTORIAL_NAME = "voting-tutorial";

// Define tutorial steps
const tutorialSteps: Tour[] = [
  {
    tour: TUTORIAL_NAME,
    steps: [
      {
        icon: <>👋</>,
        title: "Welcome to Voting Tutorial!",
        content: (
          <div className="space-y-2">
            <p>Browse through the candidates below. Each card shows a candidate's profile.</p>
          </div>
        ),
        selector: "[data-tutorial='candidate-grid']",
        side: "bottom",
        showControls: true,
        showSkip: true,
      },
      {
        icon: <>1️⃣</>,
        title: "Step 1: Select a Candidate",
        content: (
          <div className="space-y-2">
            <p>Click on any candidate card to view their detailed profile and vote.</p>
          </div>
        ),
        selector: "[data-tutorial='candidate-card']",
        side: "top",
        showControls: true,
        showSkip: true,
      },
      {
        icon: <>2️⃣</>,
        title: "Step 2: Click Vote Button",
        content: (
          <div className="space-y-2">
            <p>Click the "Vote for [Name]" button to open the voting dialog.</p>
          </div>
        ),
        selector: "[data-tutorial='vote-button']",
        side: "top",
        showControls: true,
        showSkip: true,
      },
      {
        icon: <>3️⃣</>,
        title: "Step 3: Enter Your Secret Code",
        content: (
          <div className="space-y-2">
            <p>Enter your secret voting code in this field. Make sure you have your code ready!</p>
          </div>
        ),
        selector: "[data-tutorial='secret-key-input']",
        side: "top",
        showControls: true,
        showSkip: true,
      },
      {
        icon: <>4️⃣</>,
        title: "Step 4: Submit Your Vote",
        content: (
          <div className="space-y-2">
            <p>Click "Submit Vote" to cast your vote. Remember, each code can only be used once per gender category!</p>
          </div>
        ),
        selector: "[data-tutorial='submit-vote-button']",
        side: "top",
        showControls: true,
        showSkip: true,
      },
    ],
  },
];

export { tutorialSteps, TUTORIAL_NAME };

export default function VotingTutorial() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { startNextStep, closeNextStep } = useNextStep();

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
      const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
      setIsCompleted(completed);
      
      // If tutorial is completed, show the button after a delay
      if (completed) {
        setTimeout(() => setShowButton(true), 1000);
      }
    }
  }, []);

  // Auto-start tutorial if not completed
  useEffect(() => {
    if (!isCompleted && mounted && typeof window !== "undefined") {
      // Wait for DOM elements to be ready
      const timer = setTimeout(() => {
        // Check if we're on home page (has candidate grid) or candidate page (has vote button)
        const pathname = window.location.pathname;
        const isHomePage = pathname === "/" || pathname === "";
        const isCandidatePage = pathname.startsWith("/candidate/");
        
        // Find which step's target is available on current page
        let availableStepIndex = -1;
        for (let i = 0; i < tutorialSteps[0].steps.length; i++) {
          const step = tutorialSteps[0].steps[i];
          if (step.selector) {
            const element = document.querySelector(step.selector);
            if (element !== null) {
              availableStepIndex = i;
              break;
            }
          }
        }
        
        // Only start if we have a valid target on current page
        if (availableStepIndex >= 0) {
          // If on home page, start from beginning
          // If on candidate page, check if we should resume from saved step
          const savedStep = localStorage.getItem(TUTORIAL_STEPS_KEY);
          if (savedStep && isCandidatePage) {
            // Resume from saved step if on candidate page
            const stepNum = parseInt(savedStep, 10);
            if (stepNum > 0 && availableStepIndex >= stepNum) {
              // Continue from where we left off
              startNextStep(TUTORIAL_NAME);
            } else {
              startNextStep(TUTORIAL_NAME);
            }
          } else if (isHomePage) {
            // Start from beginning on home page
            startNextStep(TUTORIAL_NAME);
          } else if (isCandidatePage && availableStepIndex >= 1) {
            // On candidate page, start tutorial (it will show appropriate step)
            startNextStep(TUTORIAL_NAME);
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, mounted, startNextStep]);

  const handleRestartTutorial = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TUTORIAL_STORAGE_KEY);
      localStorage.removeItem(TUTORIAL_STEPS_KEY);
    }
    setIsCompleted(false);
    setShowButton(false);
    // Small delay before restarting
    setTimeout(() => {
      startNextStep(TUTORIAL_NAME);
    }, 100);
  };

  // Listen for tutorial completion via storage events
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkCompletion = () => {
        const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
        if (completed && !isCompleted) {
          setIsCompleted(true);
          setShowButton(true);
        }
      };
      
      // Check on mount and periodically
      checkCompletion();
      const interval = setInterval(checkCompletion, 500);
      
      // Also listen to storage events (for cross-tab communication)
      window.addEventListener("storage", checkCompletion);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener("storage", checkCompletion);
      };
    }
  }, [isCompleted]);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Help Button - Only shown when tutorial is completed */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ 
              x: showButton ? 0 : 100, 
              opacity: showButton ? 1 : 0 
            }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999]"
            onMouseEnter={() => setShowButton(true)}
            onMouseLeave={() => {
              // Hide after delay if not hovering over button
              const timer = setTimeout(() => {
                if (buttonRef.current && !buttonRef.current.matches(":hover")) {
                  setShowButton(false);
                }
              }, 2000);
              return () => clearTimeout(timer);
            }}
          >
            <Button
              ref={buttonRef}
              onClick={handleRestartTutorial}
              className="rounded-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              aria-label="Restart voting tutorial"
            >
              <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: showButton ? "auto" : 0, 
                  opacity: showButton ? 1 : 0 
                }}
                className="ml-2 whitespace-nowrap overflow-hidden"
              >
                How to Vote
              </motion.span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
