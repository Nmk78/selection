'use client'

import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from '@/hooks/use-toast'

export default function ResultsManager() {
  const [resultsPublic, setResultsPublic] = useState(false)

  const toggleResultsVisibility = () => {
    setResultsPublic(!resultsPublic)
    toast({
      title: `Results ${!resultsPublic ? 'Published' : 'Hidden'}`,
      description: `The results are now ${!resultsPublic ? 'visible to the public' : 'hidden from the public'}.`,
    })
  }

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="results-visibility">Public Results</Label>
      <Switch
        id="results-visibility"
        checked={resultsPublic}
        onCheckedChange={toggleResultsVisibility}
      />
    </div>
  )
}

