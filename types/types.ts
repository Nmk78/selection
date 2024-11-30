export interface Candidate {
    id: string;
    name: string;
    gender: "male" | "female";
    major: string;
    height: string;
    weight: string;
    intro: string;
    hobbies: string[];
    imageUrls: string[];
    profilePic: string;
  }
  
  export type winnerCandidate = {
    id: string;
    name: string;
    title: "King" | "Queen" | "Prince" | "Princess";
    imageUrl: string;
    votes: number;
  }
  