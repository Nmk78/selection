import JudgeVoting from "@/components/JudgeVoting"
import { Candidate } from "@/types/types"


// This would typically come from an API or database
const candidates: Candidate[] = [
  {
    id: "1",
    name: "Rose Fairheart",
    major: "Environmental Science",
    gender: "female",
    height: "5'8\"",
    weight: "130 lbs",
    intro: "Passionate environmentalist with a dream of a sustainable kingdom.",
    hobbies: ["Gardening", "Hiking", "Poetry"],
    imageUrls: ["/untrack/Myat5.jpg", "/untrack/Myat2.jpg"],
    profilePic: "/untrack/Myat3.jpg"
  },
  {
    id: "2",
    name: "Lily Graceful",
    major: "Political Science",
    gender: "female",
    height: "5'6\"",
    weight: "125 lbs",
    intro: "Aspiring diplomat with a vision for international cooperation.",
    hobbies: ["Debate", "Chess", "Volunteering"],
    imageUrls: ["/untrack/Myat2.jpg", "/untrack/Myat1.jpg"],
    profilePic: "/untrack/Myat4.jpg"
  },
  // Add more candidates as needed
]

export default function JudgeVotingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Judge Voting Panel</h1>
      <JudgeVoting candidates={candidates} />
    </div>
  )
}

