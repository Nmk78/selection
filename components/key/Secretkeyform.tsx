'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Loader2, Search } from "lucide-react"
import { motion } from "framer-motion"

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200/50 rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-white">
            <Key className="w-5 h-5 md:w-6 md:h-6" />
            <span>Enter Your Key</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="secretKey" className="block text-sm font-semibold text-gray-700 mb-2">
                Secret Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="secretKey"
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter your secret key"
                  className="pl-10 h-12 text-base border-2 focus:border-purple-400 focus:ring-purple-400"
                  required
                />
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 hover:from-purple-700 hover:via-amber-600 hover:to-purple-700 text-white text-base font-semibold py-6 rounded-xl transition-all duration-300 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Check Status
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
