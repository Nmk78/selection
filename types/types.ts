// export interface Candidate {
//     id: string;
//     name: string;
//     gender: "male" | "female";
//     major: string;
//     height: string;
//     weight: string;
//     intro: string;
//     hobbies: string[];
//     imageUrls: string[];
//     profilePic: string;
//   }

export type winnerCandidate = {
  id: string;
  name: string;
  title: "King" | "Queen" | "Prince" | "Princess";
  profileImage: string;
  votes: number;
};

// Enums
export enum Round {
  PREVIEW = "preview",
  FIRST = "first",
  SECOND = "second",
  RESULT = "result",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

// Interfaces
export interface Metadata {
  id: string; // ObjectId as a string
  title: string;
  active: boolean;
  description: string;
  maleForSecondRound: number;
  femaleForSecondRound: number;
  round:
    | "preview"
    | "first"
    | "firstVotingClosed"
    | "secondPreview"
    | "second"
    | "secondVotingClosed"
    | "result";
}

export interface Candidate {
  roomId?: string;
  name: string;
  intro: string;
  gender: "male" | "female";
  major: string;
  profileImage: string; // URL of the profile image
  carouselImages: string[]; // Array of URLs for carousel images
  age: number;
  height: number;
  weight: number;
  hobbies: string[]; // Array of hobbies
}

export interface SecretKey {
  id: string; // ObjectId as a string
  adminId: string;
  secretKey: string;
  firstRoundMale: boolean;
  firstRoundFemale: boolean;
  secondRoundMale: boolean;
  secondRoundFemale: boolean;
}

export interface SpecialSecretKey {
  id: string; // ObjectId as a string
  adminId: string;
  specialSecretKey: string;
  used: boolean;
  ratings: Record<string, any>; // JSON object for ratings
}

export interface Vote {
  id: string; // ObjectId as a string
  roomId: string;
  candidateId: string;
  totalVotes: number;
  totalRating: number;
}

export interface Rating {
  id: string; // ObjectId as a string
  candidateId: string;
  rating: number;
}
