'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from '@/hooks/use-toast'

export default function SpecialKeyManager() {
  const [specialKey, setSpecialKey] = useState('')
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([])

  const generateJudgeKey = () => {
    const key = 'JUDGE-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setSpecialKey(key)
  }

  const addJudgeKey = () => {
    if (specialKey) {
      setGeneratedKeys(prev => [...prev, specialKey])
      setSpecialKey('')
      toast({
        title: "Judge Key Added",
        description: "The judge key has been added to the list.",
      })
    }
  }

  const downloadKeys = () => {
    const blob = new Blob([generatedKeys.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'judge_keys.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
        {" "}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2">
          <h3 className="text-lg font-semibold">Total</h3>
          <div className="text-sm text-gray-500">{specialKey?.length}</div>
        </div>
        {/* Used Section */}
        <div className="bg-gray-100 w-3/7 p-4 rounded-lg shadow-sm space-y-2">
          <h3 className="text-lg font-semibold">Used</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">{specialKey?.length}</div>
          </div>
        </div>
      </div>
      <Input value={specialKey} onChange={(e) => setSpecialKey(e.target.value)} placeholder="Judge Key" />
      <div className="flex space-x-2">
        <Button onClick={generateJudgeKey} className="flex-1">Generate</Button>
        <Button onClick={addJudgeKey} className="flex-1">Add</Button>
      </div>
      {generatedKeys.length > 0 && (
        <Button onClick={downloadKeys} className="w-full">Download Keys ({generatedKeys.length})</Button>
      )}
    </div>
  )
}

