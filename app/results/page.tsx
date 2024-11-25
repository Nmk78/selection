import Results from "@/components/Result";
import { winnerCandidate } from "@/types/types";

const royaltyData:winnerCandidate[] = [
  {
    id: "1",
    name: "Alexander Nobleheart",
    title: "King",
    imageUrl: "/myat2.jpg",
    votes: 15234,
  },
  {
    id: "2",
    name: "Isabella Gracewing",
    title: "Queen",
    imageUrl: "/myat3.jpg",
    votes: 14987,
  },
  {
    id: "3",
    name: "Ethan Bravesoul",
    title: "Prince",
    imageUrl: "/myat4.jpg",
    votes: 12543,
  },
  {
    id: "4",
    name: "Sophia Starlight",
    title: "Princess",
    imageUrl: "/myat5.jpg",
    votes: 13210,
  },
];

export default function ResultsPage() {
  return (
    <main className="flex flex-col items-center justify-center py-8 px-4">
      <Results results={royaltyData} />
    </main>
  );
}
