"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Calculator, ChevronLeft, Users, UserCheck, Award, EqualApproximately } from "lucide-react";
import { Crown, Sparkles, ScrollText } from "lucide-react";

const policySteps = [
    {
      title: "First Round",
      icon: <Users className="w-8 h-8" />,
      content: "All candidates are eligible. Voters can choose one male and one female candidate."
    },
    {
      title: "Selection",
      icon: <UserCheck className="w-8 h-8" />,
      content: "Top candidates are selected based on first round votes to advance to the second round."
    },
    {
      title: "Second Round",
      icon: <Award className="w-8 h-8" />,
      content: "Judges rate candidates on a 1-10 scale for Dressing, Performance, and Q&A."
    },
    {
      title: "In Case of Tie",
      icon: <EqualApproximately className="w-8 h-8" />,
      content: "Judges will choose one candidate."
    },
    {
      title: "Final Results",
      icon: <Calculator className="w-8 h-8" />,
      content: "Votes are tallied, including judges' scores. Winners are announced on stage!"
    }
  ]

export default function PolicyPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [regularVotes, setRegularVotes] = useState(100)
    const [dressingScore, setDressingScore] = useState(8)
    const [performanceScore, setPerformanceScore] = useState(8)
    const [qaScore, setQaScore] = useState(8)
    const [numJudges, setNumJudges] = useState(5)
  
    const nextStep = () => setCurrentStep((prev) => (prev + 1) % policySteps.length)
    const prevStep = () => setCurrentStep((prev) => (prev - 1 + policySteps.length) % policySteps.length)
  
    const calculateFinalScore = () => {
      const totalJudgeScore = dressingScore + performanceScore + qaScore
      return regularVotes + (totalJudgeScore * (numJudges / 3))
    }
  
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || "https://puselection.vercel.app";

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Voting Policy - PU Selection",
    description: "Understand how the PU Selection voting process works - from first round to final results",
    url: `${baseUrl}/policy`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto p-4 md:p-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <ScrollText className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-amber-600 to-purple-600 bg-clip-text text-transparent">
              Voting Policy
            </h1>
            <Crown className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
          </div>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Understand how the selection process works
          </p>
        </motion.div>
  
        {/* Policy Steps Carousel */}
        <Card className="mb-6 rounded-2xl shadow-xl border-2 border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-white">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
              <span>Selection Process</span>
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="relative h-96 mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    className={`p-6 md:p-8 rounded-2xl mb-6 shadow-xl ${
                      currentStep === 0
                        ? "bg-gradient-to-br from-blue-100 to-blue-200"
                        : currentStep === 1
                        ? "bg-gradient-to-br from-green-100 to-green-200"
                        : currentStep === 2
                        ? "bg-gradient-to-br from-purple-100 to-purple-200"
                        : currentStep === 3
                        ? "bg-gradient-to-br from-amber-100 to-amber-200"
                        : "bg-gradient-to-br from-pink-100 to-pink-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-purple-700">
                      {policySteps[currentStep].icon}
                    </div>
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                    {policySteps[currentStep].title}
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 max-w-2xl leading-relaxed">
                    {policySteps[currentStep].content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
  
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex items-center gap-2 border-2 hover:bg-purple-50 hover:border-purple-300"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <div className="flex space-x-2">
                {policySteps.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-gradient-to-r from-purple-600 to-amber-600'
                        : 'bg-gray-300'
                    }`}
                    animate={{
                      scale: index === currentStep ? 1.3 : 1,
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
              <Button
                onClick={nextStep}
                variant="outline"
                className="flex items-center gap-2 border-2 hover:bg-purple-50 hover:border-purple-300"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
  
        {/* Vote Calculation Demo */}
        <Card className="mb-6 rounded-2xl shadow-xl border-2 border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-white">
              <Calculator className="w-5 h-5 md:w-6 md:h-6" />
              <span>Vote Calculation Demo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="md:col-span-2">
                <Label htmlFor="regularVotes" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Regular Votes
                </Label>
                <Input
                  id="regularVotes"
                  type="number"
                  value={regularVotes}
                  onChange={(e) => setRegularVotes(Number(e.target.value))}
                  min={0}
                  className="h-12 text-base border-2 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="dressingScore" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Dressing Score (1-10)
                </Label>
                <Input
                  id="dressingScore"
                  type="number"
                  value={dressingScore}
                  onChange={(e) => setDressingScore(Number(e.target.value))}
                  min={1}
                  max={10}
                  className="h-12 text-base border-2 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="performanceScore" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Performance Score (1-10)
                </Label>
                <Input
                  id="performanceScore"
                  type="number"
                  value={performanceScore}
                  onChange={(e) => setPerformanceScore(Number(e.target.value))}
                  min={1}
                  max={10}
                  className="h-12 text-base border-2 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="qaScore" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Q&A Score (1-10)
                </Label>
                <Input
                  id="qaScore"
                  type="number"
                  value={qaScore}
                  onChange={(e) => setQaScore(Number(e.target.value))}
                  min={1}
                  max={10}
                  className="h-12 text-base border-2 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="numJudges" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Number of Judges
                </Label>
                <Input
                  id="numJudges"
                  type="number"
                  value={numJudges}
                  onChange={(e) => setNumJudges(Number(e.target.value))}
                  min={1}
                  className="h-12 text-base border-2 focus:border-purple-400"
                />
              </div>
            </div>
            <motion.div
              className="text-2xl md:text-3xl font-bold text-center p-6 bg-gradient-to-r from-purple-100 via-amber-100 to-purple-100 rounded-xl border-2 border-purple-200"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <span className="text-gray-700 mr-2">Final Score:</span>
              <span className="bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                {calculateFinalScore().toFixed(2)}
              </span>
            </motion.div>
          </CardContent>
        </Card>
  
        {/* Footer */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200/50 rounded-xl">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm md:text-base text-gray-600">
                For more information, please contact the event organizers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
    )
  }
  