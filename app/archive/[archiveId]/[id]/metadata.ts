// app/candidates/[id]/metadata.ts
import { getCandidateById } from "@/actions/candidate";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const candidate = await getCandidateById(id);

    if (!candidate) {
      return {
        title: "Candidate Not Found",
        description: "The requested candidate could not be found.",
      };
    }

    return {
      title: `${candidate.name} - Candidate Profile`,
      description: `Explore the profile of ${candidate.name}, a participant in the selection process. Learn more about their hobbies, major, and achievements.`,
      openGraph: {
        title: `${candidate.name}'s Profile`,
        description: `Discover ${candidate.name}'s journey in the selection process.`,
        url: `${process.env.BASE_URL}/candidates/${id}`,
        images: [
          {
            url: candidate.profileImage,
            alt: `${candidate.name}'s profile image`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${candidate.name}'s Profile`,
        description: `Check out ${candidate.name}'s details and achievements in the selection process.`,
        images: [candidate.profileImage],
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);

    return {
      title: "Error",
      description: "An error occurred while loading metadata.",
    };
  }
}
