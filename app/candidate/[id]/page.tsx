import CandidateDetails from "@/components/CandidateDetails"

// This would typically come from a database or API
const candidateData = {
  id: "1",
  name: "Rose Fairheart",
  major: "Environmental Science",
  height: "5'8\"",
  weight: "130 lbs",
  intro: "Rose is a passionate advocate for environmental causes and dreams of creating a sustainable kingdom. With her charming smile and kind heart, she hopes to win the hearts of the people and make a positive impact on the realm.",
  hobbies: ["Gardening", "Hiking", "Poetry writing", "Volunteering"],
  imageUrls: [
    "/myat.jpg",
    "/myat1.jpg",
    "/myat.jpg",
    "/myat1.jpg"
  ],
  profilePic: "/myat.jpg",
  votes: 1024
}

export default function CandidatePage() {
  return (
    <main className="flex max-w-7xl flex-col items-center justify-center md:p-7">
      <CandidateDetails {...candidateData} />

    </main>
  )
}
