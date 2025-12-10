'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function KeyInputForm() {
  const [key, setKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      router.push(`/check?key=${encodeURIComponent(key)}`)
    } catch (error) {
      console.error('Error navigating:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="secretKey" className="block text-sm font-medium text-Cprimary">
          Enter your secret key
        </label>
        <Input
          id="secretKey"
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your secret key"
          className="mt-1"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-Caccent hover:bg-Caccent/90" disabled={isLoading}>
        {isLoading ? 'Validating...' : 'Check Status'}
      </Button>
    </form>
  )
}
