import { Id } from "./_generated/dataModel";

/**
 * Configuration: Rating weight percentage
 * - 40 means 60% votes, 40% ratings
 * - 50 means 50% votes, 50% ratings
 * - 30 means 70% votes, 30% ratings
 */
const RATING_WEIGHT_PERCENTAGE = 40; // 40% rating, 60% votes

/**
 * Calculate combined score for candidates with normalized votes and ratings
 * @param candidates - Array of candidates with their vote data
 * @param votes - Array of vote records
 * @returns Array of candidates with calculated stats (totalVotes, totalRating, combinedScore)
 */
export function calculateCandidateScores<T extends { _id: Id<"candidates"> }>(
  candidates: T[],
  votes: Array<{
    candidateId: Id<"candidates">;
    totalVotes: number;
    totalRating: number;
  }>
): Array<
  T & {
    totalVotes: number;
    totalRating: number;
    combinedScore: number;
  }
> {
  // Create vote map for quick lookup
  const voteMap = new Map(
    votes.map((v) => [v.candidateId, { totalVotes: v.totalVotes, totalRating: v.totalRating }])
  );

  // Get raw values for all candidates
  const candidatesWithRawStats = candidates.map((candidate) => {
    const vote = voteMap.get(candidate._id);
    return {
      candidate,
      totalVotes: vote?.totalVotes ?? 0,
      totalRating: vote?.totalRating ?? 0,
    };
  });

  // Find max values for normalization (avoid division by zero)
  const maxVotes = Math.max(
    1,
    ...candidatesWithRawStats.map((c) => c.totalVotes)
  );
  const maxRatings = Math.max(
    1,
    ...candidatesWithRawStats.map((c) => c.totalRating)
  );

  // Calculate weights
  const voteWeight = (100 - RATING_WEIGHT_PERCENTAGE) / 100; // e.g., 0.6 for 60%
  const ratingWeight = RATING_WEIGHT_PERCENTAGE / 100; // e.g., 0.4 for 40%

  // Calculate normalized scores and combined score
  return candidatesWithRawStats.map(({ candidate, totalVotes, totalRating }) => {
    // Normalize to 0-100 scale
    const normalizedVotes = (totalVotes / maxVotes) * 100;
    const normalizedRatings = (totalRating / maxRatings) * 100;

    // Calculate combined score with weighted ratio
    // Formula: (normalizedVotes * voteWeight) + (normalizedRatings * ratingWeight)
    const combinedScore =
      normalizedVotes * voteWeight + normalizedRatings * ratingWeight;

    return {
      ...candidate,
      totalVotes,
      totalRating,
      combinedScore,
    };
  });
}

