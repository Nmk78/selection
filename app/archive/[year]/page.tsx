'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Candidate {
  id: string
  name: string
  year: number
  title: 'King' | 'Queen' | 'Prince' | 'Princess'
  imageUrl: string
  details: string
}

const pastCandidates: Candidate[] = [
  { id: '1', name: 'Elizabeth Rose', year: 2022, title: 'Queen', imageUrl: '/untrack/myat.jpg', details: 'Elizabeth Rose, our beloved Queen of 2022, brought grace and wisdom to her reign.' },
  { id: '2', name: 'William Oak', year: 2022, title: 'King', imageUrl: '/untrack/myat1.jpg', details: 'William Oak, the King of 2022, led with strength and compassion throughout his tenure.' },
  { id: '3', name: 'Sophia Pearl', year: 2021, title: 'Princess', imageUrl: '/untrack/myat2.jpg', details: 'Princess Sophia Pearl charmed all with her kindness and innovative ideas in 2021.' },
  { id: '4', name: 'James River', year: 2021, title: 'Prince', imageUrl: '/untrack/myat3.jpg', details: 'Prince James River was known for his adventurous spirit and dedication to environmental causes.' },
  { id: '5', name: 'Olivia Starr', year: 2020, title: 'Queen', imageUrl: '/untrack/myat4.jpg', details: 'Queen Olivia Starr reign in 2020 was marked by her resilience and community-focused initiatives.' },
  { id: '6', name: 'Ethan Stone', year: 2020, title: 'King', imageUrl: '/untrack/myat5.jpg', details: 'King Ethan Stone was a pillar of strength, guiding the kingdom through challenges with unwavering resolve.' },
]

export default function YearArchivePage({ params }: { params: { year: string } }) {
  const year = parseInt(params.year, 10)
  const candidates = pastCandidates.filter(candidate => candidate.year)

  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-bg to-romantic-secondary py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        className="text-gradient-2 text-4xl sm:text-5xl md:text-6xl font-script text-romantic-primary text-center mb-8 sm:mb-12 shadow-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {year} Selected Students
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {candidates.map((candidate, index) => (
          <motion.div 
          key={candidate.id} 
          className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-80 md:w-96 mx-auto group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="relative aspect-[3/4]">
            <Image
              src={candidate.imageUrl}
              alt={candidate.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h2 className="text-2xl sm:text-3xl font-script mb-2">{candidate.name}</h2>
              <p className="font-semibold text-lg sm:text-xl mb-2">{candidate.title}</p>
              <div 
                className="max-h-0 overflow-hidden group-hover:max-h-[500px] transition-all duration-500"
              >
                <p className="text-sm sm:text-base mb-4">
                  {candidate.details}
                </p>
                <p className="text-sm sm:text-base mb-4">
                  {/* Additional details */}
                  This is some extra hidden text that will appear on hover.
                </p>
                <Link 
                  href={`/archive/${year}/${candidate.id}`}
                  className="inline-flex items-center text-romantic-accent hover:text-romantic-primary transition-all duration-300 font-semibold text-lg"
                >
                  More
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
        
        ))}
      </div>
      {/* <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Link href="/" className="inline-flex items-center text-romantic-primary hover:text-romantic-accent transition-colors duration-300 font-semibold text-lg sm:text-xl">
          <span className="mr-2">Back to Home</span>
        </Link>
      </motion.div> */}
    </div>
  )
}
