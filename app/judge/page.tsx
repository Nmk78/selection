import { getCandidatesForJudge, getCandidatesForSecondRound } from "@/actions/candidate";
import { getMetadata } from "@/actions/metadata";
import JudgeVoting from "@/components/JudgeVoting";

interface Candidate {
  id: string;
  name: string;
  intro: string;
  gender: "male" | "female";
  major: string;
  profileImage: string; 
  carouselImages: string[];
  height: number;
  age: number; 
  weight: number;
  hobbies: string[]; 
}

export default async function JudgeVotingPage() {
  let candidates: any[] = [];
  let round: string | null = null;

  try {
    // Fetch round metadata
    const metadata = await getMetadata();
    round = metadata[0]?.round ?? null;

    // Check if it's the second round
    if (round === "second") {
      // Fetch data dynamically for the second round
      const { topMales, topFemales } = await getCandidatesForJudge(); // Adjust parameters as needed
      // const { topMales, topFemales } = await getCandidatesForSecondRound(); // Adjust parameters as needed
      candidates = [...topMales, ...topFemales]; // Combine and flatten male and female candidates
      console.log("🚀 ~ JudgeVotingPage ~ candidates:", candidates)
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  // Display a message if it's not the second round
  if (round !== "second") {
    return (
      <div className="container mx-auto py-8 px-4 mt-60 md:mt-52">
        <h1 className="text-3xl font-bold text-center mb-8">
          Judge Voting Panel
        </h1>
        <p className="text-center text-gray-500">
          The judge voting will be available in the second round. Please wait for the round to start.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Judge Voting Panel
      </h1>
      {/* Pass candidates dynamically */}
      <JudgeVoting candidates={candidates} />
    </div>
  );
}
