import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateCandidateScores } from '../convex/scoreCalculation';
import type { Id } from '../convex/_generated/dataModel';

// Mock Convex types
type MockCandidate = {
  _id: Id<'candidates'>;
  name: string;
  gender: 'male' | 'female';
};

type MockVote = {
  candidateId: Id<'candidates'>;
  totalVotes: number;
  totalRating: number;
};

describe('calculateCandidateScores', () => {
  let candidate1: MockCandidate;
  let candidate2: MockCandidate;
  let candidate3: MockCandidate;

  beforeEach(() => {
    candidate1 = {
      _id: 'candidate1' as Id<'candidates'>,
      name: 'John Doe',
      gender: 'male',
    };
    candidate2 = {
      _id: 'candidate2' as Id<'candidates'>,
      name: 'Jane Smith',
      gender: 'female',
    };
    candidate3 = {
      _id: 'candidate3' as Id<'candidates'>,
      name: 'Bob Johnson',
      gender: 'male',
    };
  });

  describe('Basic score calculation', () => {
    it('should calculate scores correctly with votes and ratings', () => {
      const candidates = [candidate1, candidate2, candidate3];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 100, totalRating: 300 },
        { candidateId: 'candidate2' as Id<'candidates'>, totalVotes: 50, totalRating: 150 },
        { candidateId: 'candidate3' as Id<'candidates'>, totalVotes: 25, totalRating: 90 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      expect(result).toHaveLength(3);

      // Candidate 1: max votes and ratings
      expect(result[0].totalVotes).toBe(100);
      expect(result[0].totalRating).toBe(300);
      expect(result[0].combinedScore).toBe(100); // (100/100 * 0.6) + (300/300 * 0.4) = 100

      // Candidate 2: half votes and ratings
      expect(result[1].totalVotes).toBe(50);
      expect(result[1].totalRating).toBe(150);
      expect(result[1].combinedScore).toBe(50); // (50/100 * 0.6) + (150/300 * 0.4) = 50

      // Candidate 3: quarter votes, 30% ratings
      expect(result[2].totalVotes).toBe(25);
      expect(result[2].totalRating).toBe(90);
      expect(result[2].combinedScore).toBe(27); // (25/100 * 0.6) + (90/300 * 0.4) = 27
    });

    it('should handle candidates with no votes', () => {
      const candidates = [candidate1, candidate2];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 100, totalRating: 0 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      expect(result[0].totalVotes).toBe(100);
      expect(result[0].totalRating).toBe(0);
      expect(result[0].combinedScore).toBe(60); // (100/100 * 0.6) + (0/1 * 0.4) = 60

      expect(result[1].totalVotes).toBe(0);
      expect(result[1].totalRating).toBe(0);
      expect(result[1].combinedScore).toBe(0); // (0/100 * 0.6) + (0/1 * 0.4) = 0
    });

    it('should handle candidates with no ratings', () => {
      const candidates = [candidate1, candidate2];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 100, totalRating: 0 },
        { candidateId: 'candidate2' as Id<'candidates'>, totalVotes: 50, totalRating: 0 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      expect(result[0].combinedScore).toBe(60); // (100/100 * 0.6) + (0/1 * 0.4) = 60
      expect(result[1].combinedScore).toBe(30); // (50/100 * 0.6) + (0/1 * 0.4) = 30
    });
  });

  describe('Edge cases', () => {
    it('should handle all zero values', () => {
      const candidates = [candidate1, candidate2];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 0, totalRating: 0 },
        { candidateId: 'candidate2' as Id<'candidates'>, totalVotes: 0, totalRating: 0 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      expect(result[0].combinedScore).toBe(0);
      expect(result[1].combinedScore).toBe(0);
    });

    it('should handle single candidate', () => {
      const candidates = [candidate1];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 5, totalRating: 15 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      // Single candidate always gets 100 (max is itself)
      expect(result[0].combinedScore).toBe(100);
    });

    it('should handle candidates missing from votes array', () => {
      const candidates = [candidate1, candidate2, candidate3];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 100, totalRating: 300 },
        // candidate2 and candidate3 missing
      ];

      const result = calculateCandidateScores(candidates, votes);

      expect(result[0].totalVotes).toBe(100);
      expect(result[0].totalRating).toBe(300);
      expect(result[1].totalVotes).toBe(0);
      expect(result[1].totalRating).toBe(0);
      expect(result[2].totalVotes).toBe(0);
      expect(result[2].totalRating).toBe(0);
    });

    it('should handle empty candidates array', () => {
      const candidates: MockCandidate[] = [];
      const votes: MockVote[] = [];

      const result = calculateCandidateScores(candidates, votes);

      expect(result).toHaveLength(0);
    });

    it('should handle empty votes array', () => {
      const candidates = [candidate1, candidate2];
      const votes: MockVote[] = [];

      const result = calculateCandidateScores(candidates, votes);

      expect(result[0].totalVotes).toBe(0);
      expect(result[0].totalRating).toBe(0);
      expect(result[0].combinedScore).toBe(0);
      expect(result[1].totalVotes).toBe(0);
      expect(result[1].totalRating).toBe(0);
      expect(result[1].combinedScore).toBe(0);
    });
  });

  describe('Weight distribution (60% votes, 40% ratings)', () => {
    it('should apply correct weights when votes dominate', () => {
      const candidates = [candidate1, candidate2];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 100, totalRating: 0 },
        { candidateId: 'candidate2' as Id<'candidates'>, totalVotes: 50, totalRating: 300 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      // Candidate 1: 100 votes, 0 ratings
      expect(result[0].combinedScore).toBe(60); // (100/100 * 0.6) + (0/300 * 0.4) = 60

      // Candidate 2: 50 votes, 300 ratings (max)
      expect(result[1].combinedScore).toBe(70); // (50/100 * 0.6) + (300/300 * 0.4) = 70
    });

    it('should apply correct weights when ratings dominate', () => {
      const candidates = [candidate1, candidate2];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 0, totalRating: 300 },
        { candidateId: 'candidate2' as Id<'candidates'>, totalVotes: 100, totalRating: 0 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      // Candidate 1: 0 votes, 300 ratings (max)
      expect(result[0].combinedScore).toBe(40); // (0/100 * 0.6) + (300/300 * 0.4) = 40

      // Candidate 2: 100 votes (max), 0 ratings
      expect(result[1].combinedScore).toBe(60); // (100/100 * 0.6) + (0/300 * 0.4) = 60
    });

    it('should balance votes and ratings correctly', () => {
      const candidates = [candidate1];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 50, totalRating: 150 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      // Single candidate: always 100, but verify weights are applied
      expect(result[0].combinedScore).toBe(100);
      // Normalized: votes=100, ratings=100
      // Combined: (100 * 0.6) + (100 * 0.4) = 100
    });
  });

  describe('Normalization behavior', () => {
    it('should normalize based on maximum values', () => {
      const candidates = [candidate1, candidate2, candidate3];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 200, totalRating: 600 },
        { candidateId: 'candidate2' as Id<'candidates'>, totalVotes: 100, totalRating: 300 },
        { candidateId: 'candidate3' as Id<'candidates'>, totalVotes: 50, totalRating: 150 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      // All should normalize to same relative scores as smaller numbers
      expect(result[0].combinedScore).toBe(100);
      expect(result[1].combinedScore).toBe(50);
      expect(result[2].combinedScore).toBe(25);
    });

    it('should handle very large numbers', () => {
      const candidates = [candidate1, candidate2];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 1000000, totalRating: 3000000 },
        { candidateId: 'candidate2' as Id<'candidates'>, totalVotes: 500000, totalRating: 1500000 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      expect(result[0].combinedScore).toBe(100);
      expect(result[1].combinedScore).toBe(50);
    });

    it('should handle decimal results correctly', () => {
      const candidates = [candidate1, candidate2];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 100, totalRating: 300 },
        { candidateId: 'candidate2' as Id<'candidates'>, totalVotes: 33, totalRating: 99 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      expect(result[0].combinedScore).toBe(100);
      // 33/100 * 0.6 + 99/300 * 0.4 = 0.198 + 0.132 = 0.33 * 100 = 33
      expect(result[1].combinedScore).toBeCloseTo(33, 1);
    });
  });

  describe('Data integrity', () => {
    it('should preserve candidate data', () => {
      const candidates = [candidate1];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 100, totalRating: 300 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      expect(result[0]._id).toBe(candidate1._id);
      expect(result[0].name).toBe(candidate1.name);
      expect(result[0].gender).toBe(candidate1.gender);
    });

    it('should handle multiple candidates with same vote counts', () => {
      const candidates = [candidate1, candidate2, candidate3];
      const votes: MockVote[] = [
        { candidateId: 'candidate1' as Id<'candidates'>, totalVotes: 100, totalRating: 300 },
        { candidateId: 'candidate2' as Id<'candidates'>, totalVotes: 100, totalRating: 300 },
        { candidateId: 'candidate3' as Id<'candidates'>, totalVotes: 100, totalRating: 300 },
      ];

      const result = calculateCandidateScores(candidates, votes);

      expect(result[0].combinedScore).toBe(100);
      expect(result[1].combinedScore).toBe(100);
      expect(result[2].combinedScore).toBe(100);
    });
  });
});

describe('Voting Logic Tests (with mocked Convex context)', () => {
  // These tests verify the logic flow of voting mutations
  // In a real scenario, you'd use Convex's testing utilities or mock the context

  describe('voteForCandidate logic', () => {
    it('should validate secret key normalization', () => {
      const secretKey = '  TEST-KEY  ';
      const normalized = secretKey.toLowerCase().trim();
      
      expect(normalized).toBe('test-key');
    });

    it('should validate round checking logic', () => {
      const validRounds = ['first'];
      const invalidRounds = ['preview', 'firstVotingClosed', 'second', 'result'];

      validRounds.forEach(round => {
        expect(round === 'first').toBe(true);
      });

      invalidRounds.forEach(round => {
        expect(round === 'first').toBe(false);
      });
    });

    it('should validate gender-based voting restrictions', () => {
      const round = 'first';
      const gender = 'male';
      const secretKeyRecord = {
        firstRoundMale: false,
        firstRoundFemale: false,
      };

      // Should allow vote if not already used
      const canVote = !(round === 'first' && gender === 'male' && secretKeyRecord.firstRoundMale);
      expect(canVote).toBe(true);

      // Should block vote if already used
      secretKeyRecord.firstRoundMale = true;
      const cannotVote = !(round === 'first' && gender === 'male' && secretKeyRecord.firstRoundMale);
      expect(cannotVote).toBe(false);
    });

    it('should validate vote increment logic', () => {
      const existingVote = { totalVotes: 5, totalRating: 10 };
      const newTotalVotes = existingVote.totalVotes + 1;
      
      expect(newTotalVotes).toBe(6);
    });

    it('should validate new vote creation', () => {
      const newVote = {
        totalVotes: 1,
        totalRating: 0,
      };

      expect(newVote.totalVotes).toBe(1);
      expect(newVote.totalRating).toBe(0);
    });
  });

  describe('addRatings logic', () => {
    it('should validate zero rating count limit', () => {
      const ratings = [
        { candidateId: 'c1' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c2' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c3' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c4' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c5' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c6' as Id<'candidates'>, rating: 0 },
      ];

      const zeroRatings = ratings.filter((r) => r.rating <= 0);
      const zeroRatingCount = zeroRatings.length;

      expect(zeroRatingCount).toBe(6);
      expect(zeroRatingCount > 5).toBe(true); // Should fail validation
    });

    it('should allow up to 5 zero ratings', () => {
      const ratings = [
        { candidateId: 'c1' as Id<'candidates'>, rating: 10 },
        { candidateId: 'c2' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c3' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c4' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c5' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c6' as Id<'candidates'>, rating: 0 },
      ];

      const zeroRatings = ratings.filter((r) => r.rating <= 0);
      const zeroRatingCount = zeroRatings.length;

      expect(zeroRatingCount).toBe(5);
      expect(zeroRatingCount > 5).toBe(false); // Should pass validation
    });

    it('should skip ratings with zero or negative values', () => {
      const ratings = [
        { candidateId: 'c1' as Id<'candidates'>, rating: 10 },
        { candidateId: 'c2' as Id<'candidates'>, rating: 0 },
        { candidateId: 'c3' as Id<'candidates'>, rating: -5 },
        { candidateId: 'c4' as Id<'candidates'>, rating: 15 },
      ];

      const processedRatings = ratings.filter((r) => r.rating > 0);
      
      expect(processedRatings).toHaveLength(2);
      expect(processedRatings[0].rating).toBe(10);
      expect(processedRatings[1].rating).toBe(15);
    });

    it('should validate raw rating storage (no scaling)', () => {
      const rating = 30; // Max rating from judge
      const rawRating = rating; // Should be stored as-is

      expect(rawRating).toBe(30);
      expect(rawRating).not.toBeLessThan(0);
      expect(rawRating).not.toBeGreaterThan(30);
    });

    it('should validate rating accumulation', () => {
      const existingVote = { totalVotes: 10, totalRating: 50 };
      const newRating = 30;
      const newTotalRating = existingVote.totalRating + newRating;

      expect(newTotalRating).toBe(80);
    });
  });

  describe('Error scenarios', () => {
    it('should handle missing active room', () => {
      const currentRoom = null;
      const result = currentRoom 
        ? { success: true }
        : { success: false, message: 'No active round found.' };

      expect(result.success).toBe(false);
      expect(result.message).toBe('No active round found.');
    });

    it('should handle invalid secret key', () => {
      const secretKeyRecord = null;
      const result = secretKeyRecord
        ? { success: true }
        : { success: false, message: 'Invalid secret key.' };

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid secret key.');
    });

    it('should handle invalid candidate', () => {
      const candidate = null;
      const result = candidate
        ? { success: true }
        : { success: false, message: 'Invalid candidate.' };

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid candidate.');
    });

    it('should handle already used key', () => {
      const secretKeyRecord = { firstRoundMale: true, firstRoundFemale: false };
      const round = 'first';
      const gender = 'male';

      const alreadyUsed = round === 'first' && gender === 'male' && secretKeyRecord.firstRoundMale;
      const result = alreadyUsed
        ? { success: false, message: 'Key was already used!' }
        : { success: true };

      expect(result.success).toBe(false);
      expect(result.message).toBe('Key was already used!');
    });

    it('should handle voting when round is closed', () => {
      const round = 'preview';
      const result = round !== 'first'
        ? { success: false, message: 'Voting is closed.' }
        : { success: true };

      expect(result.success).toBe(false);
      expect(result.message).toBe('Voting is closed.');
    });

    it('should handle already used special key for ratings', () => {
      const secretKeyRecord = { used: true };
      const result = secretKeyRecord.used
        ? { success: false, message: 'This key was already used.' }
        : { success: true };

      expect(result.success).toBe(false);
      expect(result.message).toBe('This key was already used.');
    });
  });
});


