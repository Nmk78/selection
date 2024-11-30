import { Candidate } from "@/types/types"
import CandidateCard from "./CandidateCard"

const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    gender: "female",
    major: 'Computer Science',
    height: '5\'6"',
    weight: '130 lbs',
    intro: 'Passionate about technology and community service',
    hobbies: ['Coding', 'Volunteering', 'Photography'],
    imageUrls: ['/untrack/myat1.jpg', '/untrack/myat.jpg', '/untrack/myat1.jpg'],
    profilePic: '/untrack/myat.jpg',
  },
  {
    id: '2',
    name: 'Michael Chen',
    gender: "female",
    major: 'Business Administration',
    height: '5\'10"',
    weight: '160 lbs',
    intro: 'Aspiring entrepreneur with a love for campus activities',
    hobbies: ['Basketball', 'Public Speaking', 'Chess'],
    imageUrls: ['/untrack/myat1.jpg', '/untrack/myat.jpg', '/untrack/myat1.jpg'],
    profilePic: '/untrack/myat.jpg',
  },
  // Add more candidates as needed
]

export default function CandidateSelection() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-Cprimary mb-6 text-center font-quindelia">PU Selection</h1>
      <div className="space-y-6 sm:space-y-8">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  )
}