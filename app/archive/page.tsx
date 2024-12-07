import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Crown } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  year: number
  title: 'King' | 'Queen' | 'Prince' | 'Princess'
  imageUrl: string
}

const pastCandidates: Candidate[] = [
  { id: '1', name: 'Elizabeth Rose', year: 2022, title: 'Queen', imageUrl: '/untrack/myat.jpg' },
  { id: '2', name: 'William Oak', year: 2022, title: 'King', imageUrl: '/untrack/myat1.jpg' },
  { id: '3', name: 'Sophia Pearl', year: 2021, title: 'Princess', imageUrl: '/untrack/myat2.jpg' },
  { id: '4', name: 'James River', year: 2021, title: 'Prince', imageUrl: '/untrack/myat3.jpg' },
  { id: '5', name: 'Olivia Starr', year: 2020, title: 'Queen', imageUrl: '/untrack/myat4.jpg' },
  { id: '6', name: 'Ethan Stone', year: 2020, title: 'King', imageUrl: '/untrack/myat5.jpg' },
]

export default function YearArchivePage({ params }: { params: { year: string } }) {
  const year = parseInt(params.year, 10)
  const candidates = pastCandidates.filter(candidate => candidate.year === year)

  if (candidates.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-bg to-romantic-secondary py-12 px-4">
      <h1 className="text-5xl md:text-6xl font-script text-romantic-primary text-center mb-8 shadow-text">
        {year} Royal Selection
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-[3/4]">
              <Image
                src={candidate.imageUrl}
                alt={candidate.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="text-2xl font-script mb-1">{candidate.name}</h2>
                <div className="flex items-center space-x-2">
                  <Crown className="text-yellow-400" size={20} />
                  <span className="font-semibold">{candidate.title}</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <Link href={`/archive/${year}/${candidate.id}`} className="text-romantic-primary hover:text-romantic-accent transition-colors duration-300 font-semibold">
                View Royal Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/" className="text-romantic-primary hover:text-romantic-accent transition-colors duration-300 font-semibold">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

