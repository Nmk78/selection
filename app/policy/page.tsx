'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft, Users, UserCheck, Award, Calculator } from 'lucide-react'

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
    content: "Judges rate candidates on a 1-10 scale."
  },
  {
    title: "Final Results",
    icon: <Calculator className="w-8 h-8" />,
    content: "Votes are tallied, including judges' scores. Winners are announced on stage!"
  }
]

export default function VotingPolicy() {
  const [currentStep, setCurrentStep] = useState(0)
  const [regularVotes, setRegularVotes] = useState(100)
  const [judgeRating, setJudgeRating] = useState(8)
  const [numJudges, setNumJudges] = useState(5)

  const nextStep = () => setCurrentStep((prev) => (prev + 1) % policySteps.length)
  const prevStep = () => setCurrentStep((prev) => (prev - 1 + policySteps.length) % policySteps.length)

  const calculateFinalScore = () => {
    return regularVotes + (judgeRating * (numJudges / 2))
  }

  return (
    <div className="max-w-4xl md:my-5 mx-auto p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900">Voting Policy</h1>
      
      <div className="relative h-80 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <div className="bg-white p-6 rounded-full mb-4 shadow-md">
              {policySteps[currentStep].icon}
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-800">{policySteps[currentStep].title}</h2>
            <p className="text-lg text-gray-600">{policySteps[currentStep].content}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mb-8">
        <Button onClick={prevStep} variant="outline" className="flex items-center">
          <ChevronLeft className="mr-2" /> Previous
        </Button>
        <div className="flex space-x-2">
          {policySteps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentStep ? 'bg-indigo-600' : 'bg-indigo-200'}`}
              animate={{ scale: index === currentStep ? 1.2 : 1 }}
            />
          ))}
        </div>
        <Button onClick={nextStep} variant="outline" className="flex items-center">
          Next <ChevronRight className="ml-2" />
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-800">Vote Calculation Demo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="regularVotes">Regular Votes</Label>
              <Input
                id="regularVotes"
                type="number"
                value={regularVotes}
                onChange={(e) => setRegularVotes(Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="judgeRating">Avg Judge Rating (1-10)</Label>
              <Input
                id="judgeRating"
                type="number"
                value={judgeRating}
                onChange={(e) => setJudgeRating(Number(e.target.value))}
                min={1}
                max={10}
              />
            </div>
            <div>
              <Label htmlFor="numJudges">Number of Judges</Label>
              <Input
                id="numJudges"
                type="number"
                value={numJudges}
                onChange={(e) => setNumJudges(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>
          <motion.div
            className="text-2xl font-bold text-center p-4 bg-indigo-100 rounded-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            Final Score: {calculateFinalScore().toFixed(2)}
          </motion.div>
        </CardContent>
      </Card>

      <div className="text-center text-gray-600">
        <p>For more information, please contact the event organizers.</p>
      </div>
    </div>
  )
}

