import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Candidate {
  id: string
  name: string
  year: number
  title: 'King' | 'Queen' | 'Prince' | 'Princess'
  imageUrl: string
  details: string
}

const pastCandidates: Candidate[] = [
  { id: '1', name: 'Elizabeth Rose', year: 2022, title: 'Queen', imageUrl: '/untrack/myat.jpg', details: 'Elizabeth Rose, our beloved Queen of 2022, brought grace and wisdom to her reign. Her initiatives in education and healthcare left a lasting impact on the kingdom.' },
  { id: '2', name: 'William Oak', year: 2022, title: 'King', imageUrl: '/untrack/myat1.jpg', details: 'William Oak, the King of 2022, led with strength and compassion throughout his tenure. His focus on sustainable development transformed the kingdom economy.' },
  { id: '3', name: 'Sophia Pearl', year: 2021, title: 'Princess', imageUrl: '/untrack/myat2.jpg', details: 'Princess Sophia Pearl charmed all with her kindness and innovative ideas in 2021. Her youth outreach programs inspired a new generation of leaders.' },
  { id: '4', name: 'James River', year: 2021, title: 'Prince', imageUrl: '/untrack/myat3.jpg', details: 'Prince James River was known for his adventurous spirit and dedication to environmental causes. His conservation efforts protected vast areas of the kingdom natural beauty.' },
  { id: '5', name: 'Olivia Starr', year: 2020, title: 'Queen', imageUrl: '/untrack/myat4.jpg', details: 'Queen Olivia Starr reign in 2020 was marked by her resilience and community-focused initiatives. She guided the kingdom through challenging times with grace and determination.' },
  { id: '6', name: 'Ethan Stone', year: 2020, title: 'King', imageUrl: '/untrack/myat5.jpg', details: 'King Ethan Stone was a pillar of strength, guiding the kingdom through challenges with unwavering resolve. His diplomatic skills fostered peace and prosperity in the region.' },
]

export default function CandidateDetailPage({ params }: { params: { year: string, id: string } }) {
  const year = parseInt(params.year, 10)
  const candidate = pastCandidates.find(c => c.id === params.id && c.year === year)

  if (!candidate) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-bg to-romantic-secondary py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-xl">
        <div className="relative aspect-video">
          <Image
            src={candidate.imageUrl}
            alt={candidate.name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-script mb-2">{candidate.name}</h1>
            <p className="text-2xl sm:text-3xl font-semibold">{candidate.title} of {candidate.year}</p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-lg sm:text-xl mb-6">{candidate.details}</p>
          <Link 
            href={`/archive/${year}`}
            className="inline-flex items-center text-romantic-primary hover:text-romantic-accent transition-colors duration-300 font-semibold text-lg sm:text-xl"
          >
            <span className="mr-2">Back to {year} Royalty</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

