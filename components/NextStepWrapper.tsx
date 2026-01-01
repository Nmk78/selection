"use client";

import { NextStep } from "nextstepjs";
import { tutorialSteps } from "./VotingTutorial";

interface NextStepWrapperProps {
  children: React.ReactNode;
}

export default function NextStepWrapper({ children }: NextStepWrapperProps) {
  return (
    <NextStep
      steps={tutorialSteps}
      onComplete={(tourName) => {
        if (tourName === "voting-tutorial" && typeof window !== "undefined") {
          localStorage.setItem("voting-tutorial-completed", "true");
        }
      }}
      onStepChange={(step, tourName) => {
        if (tourName === "voting-tutorial" && typeof window !== "undefined") {
          localStorage.setItem("voting-tutorial-steps-completed", step.toString());
        }
      }}
    >
      {children}
    </NextStep>
  );
}

