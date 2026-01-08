# Score Calculation Documentation

## Overview

The score calculation system combines **student votes** and **judge ratings** into a single combined score for each candidate. The system uses normalization to ensure fair comparison across candidates, regardless of the absolute number of votes or ratings.

## Configuration

- **RATING_WEIGHT_PERCENTAGE**: `40` (40% ratings, 60% votes)
- **Vote Weight**: `60%` (calculated as `100 - RATING_WEIGHT_PERCENTAGE`)
- **Rating Weight**: `40%` (from `RATING_WEIGHT_PERCENTAGE`)

This means votes have a 60% influence and ratings have a 40% influence on the final combined score.

## Calculation Formula

The combined score is calculated using the following steps:

1. **Normalize votes** to a 0-100 scale based on the maximum votes in the group
2. **Normalize ratings** to a 0-100 scale based on the maximum ratings in the group
3. **Apply weighted combination**:
   ```
   combinedScore = (normalizedVotes × 0.6) + (normalizedRatings × 0.4)
   ```

### Detailed Formula

```
normalizedVotes = (candidateVotes / maxVotes) × 100
normalizedRatings = (candidateRatings / maxRatings) × 100
combinedScore = (normalizedVotes × voteWeight) + (normalizedRatings × ratingWeight)
```

Where:
- `maxVotes` = maximum `totalVotes` among all candidates (minimum 1)
- `maxRatings` = maximum `totalRating` among all candidates (minimum 1)
- `voteWeight` = 0.6 (60%)
- `ratingWeight` = 0.4 (40%)

## Examples

### Example 1: Basic Calculation with Multiple Candidates

**Input:**
- Candidate A: 100 votes, 300 ratings
- Candidate B: 50 votes, 150 ratings
- Candidate C: 25 votes, 90 ratings

**Step 1: Find Maximums**
- `maxVotes` = 100 (highest vote count)
- `maxRatings` = 300 (highest rating total)

**Step 2: Normalize Each Candidate**

**Candidate A:**
- `normalizedVotes` = (100 / 100) × 100 = 100
- `normalizedRatings` = (300 / 300) × 100 = 100
- `combinedScore` = (100 × 0.6) + (100 × 0.4) = 60 + 40 = **100**

**Candidate B:**
- `normalizedVotes` = (50 / 100) × 100 = 50
- `normalizedRatings` = (150 / 300) × 100 = 50
- `combinedScore` = (50 × 0.6) + (50 × 0.4) = 30 + 20 = **50**

**Candidate C:**
- `normalizedVotes` = (25 / 100) × 100 = 25
- `normalizedRatings` = (90 / 300) × 100 = 30
- `combinedScore` = (25 × 0.6) + (30 × 0.4) = 15 + 12 = **27**

**Result:**
| Candidate | Votes | Ratings | Normalized Votes | Normalized Ratings | Combined Score |
|-----------|-------|---------|-------------------|--------------------|----------------|
| A         | 100   | 300     | 100               | 100                | 100            |
| B         | 50    | 150     | 50                | 50                 | 50             |
| C         | 25    | 90      | 25                | 30                 | 27             |

---

### Example 2: Candidate with No Ratings

**Input:**
- Candidate A: 100 votes, 0 ratings
- Candidate B: 50 votes, 0 ratings

**Step 1: Find Maximums**
- `maxVotes` = 100
- `maxRatings` = 1 (minimum value, since all ratings are 0)

**Step 2: Normalize Each Candidate**

**Candidate A:**
- `normalizedVotes` = (100 / 100) × 100 = 100
- `normalizedRatings` = (0 / 1) × 100 = 0
- `combinedScore` = (100 × 0.6) + (0 × 0.4) = 60 + 0 = **60**

**Candidate B:**
- `normalizedVotes` = (50 / 100) × 100 = 50
- `normalizedRatings` = (0 / 1) × 100 = 0
- `combinedScore` = (50 × 0.6) + (0 × 0.4) = 30 + 0 = **30**

**Result:**
| Candidate | Votes | Ratings | Normalized Votes | Normalized Ratings | Combined Score |
|-----------|-------|---------|-------------------|--------------------|----------------|
| A         | 100   | 0       | 100               | 0                  | 60             |
| B         | 50    | 0       | 50                | 0                  | 30             |

---

### Example 3: Candidate with No Votes

**Input:**
- Candidate A: 100 votes, 200 ratings
- Candidate B: 0 votes, 0 ratings

**Step 1: Find Maximums**
- `maxVotes` = 100
- `maxRatings` = 200

**Step 2: Normalize Each Candidate**

**Candidate A:**
- `normalizedVotes` = (100 / 100) × 100 = 100
- `normalizedRatings` = (200 / 200) × 100 = 100
- `combinedScore` = (100 × 0.6) + (100 × 0.4) = 60 + 40 = **100**

**Candidate B:**
- `normalizedVotes` = (0 / 100) × 100 = 0
- `normalizedRatings` = (0 / 200) × 100 = 0
- `combinedScore` = (0 × 0.6) + (0 × 0.4) = 0 + 0 = **0**

**Result:**
| Candidate | Votes | Ratings | Normalized Votes | Normalized Ratings | Combined Score |
|-----------|-------|---------|-------------------|--------------------|----------------|
| A         | 100   | 200     | 100               | 100                | 100            |
| B         | 0     | 0       | 0                 | 0                  | 0              |

---

### Example 4: Uneven Performance (High Votes, Low Ratings)

**Input:**
- Candidate A: 100 votes, 50 ratings
- Candidate B: 50 votes, 200 ratings

**Step 1: Find Maximums**
- `maxVotes` = 100
- `maxRatings` = 200

**Step 2: Normalize Each Candidate**

**Candidate A:**
- `normalizedVotes` = (100 / 100) × 100 = 100
- `normalizedRatings` = (50 / 200) × 100 = 25
- `combinedScore` = (100 × 0.6) + (25 × 0.4) = 60 + 10 = **70**

**Candidate B:**
- `normalizedVotes` = (50 / 100) × 100 = 50
- `normalizedRatings` = (200 / 200) × 100 = 100
- `combinedScore` = (50 × 0.6) + (100 × 0.4) = 30 + 40 = **70**

**Result:**
| Candidate | Votes | Ratings | Normalized Votes | Normalized Ratings | Combined Score |
|-----------|-------|---------|-------------------|--------------------|----------------|
| A         | 100   | 50      | 100               | 25                 | 70             |
| B         | 50    | 200     | 50                | 100                | 70             |

**Note:** Both candidates have the same combined score (70) despite different strengths. This demonstrates how the 60/40 weighting balances votes and ratings.

---

### Example 5: All Zero Values

**Input:**
- Candidate A: 0 votes, 0 ratings
- Candidate B: 0 votes, 0 ratings

**Step 1: Find Maximums**
- `maxVotes` = 1 (minimum value)
- `maxRatings` = 1 (minimum value)

**Step 2: Normalize Each Candidate**

**Candidate A:**
- `normalizedVotes` = (0 / 1) × 100 = 0
- `normalizedRatings` = (0 / 1) × 100 = 0
- `combinedScore` = (0 × 0.6) + (0 × 0.4) = 0 + 0 = **0**

**Candidate B:**
- `normalizedVotes` = (0 / 1) × 100 = 0
- `normalizedRatings` = (0 / 1) × 100 = 0
- `combinedScore` = (0 × 0.6) + (0 × 0.4) = 0 + 0 = **0**

**Result:**
| Candidate | Votes | Ratings | Normalized Votes | Normalized Ratings | Combined Score |
|-----------|-------|---------|-------------------|--------------------|----------------|
| A         | 0     | 0       | 0                 | 0                  | 0              |
| B         | 0     | 0       | 0                 | 0                  | 0              |

---

## Key Features

### 1. Normalization
- Both votes and ratings are normalized to a 0-100 scale
- This ensures fair comparison regardless of absolute values
- The candidate with the highest votes gets 100 normalized votes
- The candidate with the highest ratings gets 100 normalized ratings

### 2. Weighted Combination
- Votes contribute 60% to the final score
- Ratings contribute 40% to the final score
- This weighting can be adjusted by changing `RATING_WEIGHT_PERCENTAGE`

### 3. Division by Zero Protection
- If all votes are 0, `maxVotes` defaults to 1
- If all ratings are 0, `maxRatings` defaults to 1
- This prevents division by zero errors

### 4. Missing Data Handling
- Candidates without vote records default to 0 votes and 0 ratings
- They receive a combined score of 0

## Adjusting the Weight Configuration

To change the balance between votes and ratings, modify `RATING_WEIGHT_PERCENTAGE` in `scoreCalculation.ts`:

```typescript
// Current: 40% ratings, 60% votes
const RATING_WEIGHT_PERCENTAGE = 40;

// For 50/50 split:
const RATING_WEIGHT_PERCENTAGE = 50; // 50% ratings, 50% votes

// For 30% ratings, 70% votes:
const RATING_WEIGHT_PERCENTAGE = 30; // 30% ratings, 70% votes
```

## Function Signature

```typescript
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
>
```

## Usage

The function is used throughout the codebase to calculate scores for candidates in various contexts:
- Overall candidate rankings
- Gender-separated rankings (male/female)
- Room-specific rankings
- Historical/archived data

All calculations use the same normalization and weighting logic for consistency.

