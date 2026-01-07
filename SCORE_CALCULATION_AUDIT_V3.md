# Score Calculation Logic Audit V3

**Date**: Current Audit  
**Status**: Comprehensive Review

## Overview
This audit examines the current score calculation logic after the refactoring to use a centralized `calculateCandidateScores` helper function. The system combines student votes (60%) and judge ratings (40%) to produce a final combined score.

---

## Current Implementation

### 1. Vote Submission (`convex/votes.ts` - `voteForCandidate`)
**Location**: Lines 8-120

**Process**:
1. Student submits vote with secret key
2. System validates key and checks if already used for this gender/round
3. Finds or creates vote record
4. **Increments `totalVotes` by 1**

**Code**:
```typescript
if (existingVote) {
  await ctx.db.patch(existingVote._id, {
    totalVotes: existingVote.totalVotes + 1,
  });
} else {
  await ctx.db.insert("votes", {
    roomId: currentRoom._id,
    candidateId: args.candidateId,
    totalVotes: 1,
    totalRating: 0,
  });
}
```

**Status**: ✅ **CORRECT** - Simple increment, no issues

---

### 2. Rating Submission (`convex/votes.ts` - `addRatings`)
**Location**: Lines 125-216

**Process**:
1. Judge rates 3 categories (dressing, performance, QA) - each 0-10
2. Frontend sums and rounds: `Math.round(dressing + performance + QA)` → **max 30 per judge**
3. Backend receives rating (0-30)
4. **Stores raw rating directly** in `totalRating` (no scaling)

**Code** (Lines 179-205):
```typescript
for (const { candidateId, rating } of args.ratings) {
  if (rating <= 0) continue;

  // Store raw rating - normalization handled by calculateCandidateScores
  const rawRating = rating;

  if (existingVote) {
    await ctx.db.patch(existingVote._id, {
      totalRating: existingVote.totalRating + rawRating,
    });
  } else {
    await ctx.db.insert("votes", {
      roomId: activeMetadata._id,
      candidateId,
      totalVotes: 0,
      totalRating: rawRating,
    });
  }
}
```

**Status**: ✅ **CORRECT** - Raw ratings stored, normalization handled by helper function

**Note**: Previous audit identified scaling issue, which has been **FIXED** - ratings are now stored raw.

---

### 3. Score Calculation (`convex/scoreCalculation.ts` - `calculateCandidateScores`)
**Location**: Lines 17-78

**Process**:
1. Receives candidates and vote records
2. Extracts `totalVotes` and `totalRating` from vote records
3. **Normalizes both to 0-100 scale** based on max values in the room
4. Applies weighted combination:
   - `voteWeight = 0.6` (60%)
   - `ratingWeight = 0.4` (40%)
   - `combinedScore = (normalizedVotes × 0.6) + (normalizedRatings × 0.4)`

**Code**:
```typescript
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
const voteWeight = (100 - RATING_WEIGHT_PERCENTAGE) / 100; // 0.6
const ratingWeight = RATING_WEIGHT_PERCENTAGE / 100; // 0.4

// Normalize to 0-100 scale
const normalizedVotes = (totalVotes / maxVotes) * 100;
const normalizedRatings = (totalRating / maxRatings) * 100;

// Calculate combined score
const combinedScore =
  normalizedVotes * voteWeight + normalizedRatings * ratingWeight;
```

**Status**: ✅ **CORRECT** - Proper normalization and weighting

**Configuration**:
- `RATING_WEIGHT_PERCENTAGE = 40` (40% ratings, 60% votes)
- Can be adjusted by changing the constant

---

## Issues Identified

### 🟡 **MEDIUM ISSUE #1: Normalization Edge Case - Single Candidate**

**Problem**: When there's only one candidate in a room:
- `maxVotes = totalVotes` (or 1 if 0 votes)
- `maxRatings = totalRatings` (or 1 if 0 ratings)
- Normalized values become 100 (or 0)
- Combined score is always 100 (or 0), regardless of actual performance

**Example**:
- Single candidate with 5 votes and 15 rating
- Normalized: votes = 100, ratings = 100
- Combined: (100 × 0.6) + (100 × 0.4) = 100
- **No differentiation possible**

**Impact**: 
- Low impact - only affects edge cases with single candidate
- Results are mathematically correct but not meaningful

**Recommendation**: 
- Current behavior is acceptable for edge case
- Could add explicit handling/documentation for single-candidate scenarios
- Consider if this scenario should be allowed in the system

---

### 🟡 **MEDIUM ISSUE #2: Normalization Edge Case - All Zero Values**

**Problem**: If all candidates have 0 votes or 0 ratings:
- `maxVotes = 1` (fallback to avoid division by zero)
- `maxRatings = 1` (fallback to avoid division by zero)
- All candidates get normalized to 0, which is correct
- But the fallback of 1 is arbitrary

**Code**:
```typescript
const maxVotes = Math.max(
  1,  // Fallback
  ...candidatesWithRawStats.map((c) => c.totalVotes)
);
```

**Impact**: 
- Low impact - only affects edge cases
- Results are still correct (all zeros normalize to 0)
- The fallback prevents division by zero

**Recommendation**: 
- Current implementation is acceptable
- Could add explicit handling for "no votes yet" scenario
- Consider returning early if all values are zero

---

### 🟡 **MEDIUM ISSUE #3: Gender-Separated Normalization in Leaderboard**

**Problem**: In `getWithStatsForLeaderboard`, scores are calculated separately for males and females:
- Male candidates normalized based on max votes/ratings **among males only**
- Female candidates normalized based on max votes/ratings **among females only**
- Then combined and sorted together

**Code** (convex/candidates.ts lines 162-169):
```typescript
const malesWithStatsRaw = calculateCandidateScores(allMaleCandidates, votes);
const femalesWithStatsRaw = calculateCandidateScores(allFemaleCandidates, votes);
```

**Impact**: 
- If one gender has much higher absolute vote/rating counts, their normalized scores might be artificially lower
- Example: If males have 200 max votes and females have 50 max votes:
  - Male with 100 votes → normalized to 50
  - Female with 50 votes → normalized to 100
  - Female appears to score higher despite fewer absolute votes

**Analysis**:
- This might be **intentional** to ensure fair competition within each gender
- However, when combining genders for final ranking, scores may not be directly comparable
- Other queries (`getWithStats`, `getForSecondRound`) normalize across all candidates

**Recommendation**: 
- **Clarify intent**: Is gender-separated normalization desired?
- If yes: Document this behavior clearly
- If no: Calculate scores for all candidates together, then filter by gender

---

### 🟡 **MEDIUM ISSUE #4: Normalization May Favor Candidates with Mixed Performance**

**Problem**: Normalization is based on the **maximum** value in the room, not the average or median. This means:
- If one candidate has very high votes but low ratings, they become the "100" baseline
- Other candidates are normalized relative to this maximum
- A candidate with balanced votes/ratings might score lower than one with extreme values in one category

**Example Scenario**:
- Candidate A: 100 votes, 0 ratings → normalized: votes=100, ratings=0 → combined=60
- Candidate B: 50 votes, 30 ratings → normalized: votes=50, ratings=100 → combined=70
- Candidate C: 50 votes, 15 ratings → normalized: votes=50, ratings=50 → combined=50

**Impact**: 
- Medium impact - this is a design choice
- The system rewards candidates who excel in either category
- May not be the intended behavior if balanced performance is desired

**Recommendation**: 
- Current behavior is mathematically sound
- Consider if this is the desired ranking behavior
- Could document this as a feature (rewards excellence in either category)

---

### 🟢 **MINOR ISSUE #5: Precision in Combined Score**

**Problem**: The combined score calculation may produce floating-point values:
- `combinedScore` can be a decimal (e.g., 45.67)
- When sorting, these are compared correctly
- But display might need rounding

**Impact**: 
- Very low impact - JavaScript handles floating-point comparisons correctly
- Display formatting should handle decimals

**Recommendation**: 
- Current implementation is fine
- Ensure UI rounds/formats scores appropriately for display
- Consider if integer scores are desired (could round at calculation)

---

### 🟢 **MINOR ISSUE #6: Missing Candidates in Vote Records**

**Problem**: If a candidate has no vote record:
- `voteMap.get(candidate._id)` returns `undefined`
- Falls back to `totalVotes: 0, totalRating: 0` ✅
- This is handled correctly

**Status**: ✅ **HANDLED CORRECTLY** - No issue

---

### 🟢 **MINOR ISSUE #7: Rating Validation**

**Problem**: The `addRatings` mutation validates:
- Only up to 5 candidates can have 0 ratings (line 170)
- But doesn't validate maximum rating per candidate

**Current Validation**:
```typescript
if (zeroRatingCount > 5) {
  return {
    success: false,
    message: "Please rate all categories.",
  };
}
```

**Impact**: 
- Low impact - frontend should handle max rating (30)
- Backend could add additional validation

**Recommendation**: 
- Consider adding validation: `if (rating > 30) return error`
- Or document that frontend is responsible for this validation

---

## Data Flow Diagram

```
Student Vote
    ↓
totalVotes += 1
    ↓
    └─→ [calculateCandidateScores]
        └─→ Normalize votes to 0-100 (based on max votes)
        └─→ Apply 60% weight
        └─→ combinedScore

Judge Rating (3 categories × 10 each = 0-30)
    ↓
Frontend: Math.round(dressing + performance + QA) → 0-30
    ↓
Backend: Store raw rating (0-30) ✅
    ↓
totalRating += rawRating
    ↓
    └─→ [calculateCandidateScores]
        └─→ Normalize ratings to 0-100 (based on max ratings)
        └─→ Apply 40% weight
        └─→ combinedScore
```

---

## Testing Scenarios

### Scenario 1: Standard Case
**Setup**:
- 3 candidates
- Candidate A: 100 votes, 300 ratings (10 judges × 30)
- Candidate B: 50 votes, 150 ratings (5 judges × 30)
- Candidate C: 25 votes, 90 ratings (3 judges × 30)

**Calculation**:
- maxVotes = 100, maxRatings = 300
- A: votes=100, ratings=100 → combined = (100×0.6) + (100×0.4) = **100**
- B: votes=50, ratings=50 → combined = (50×0.6) + (50×0.4) = **50**
- C: votes=25, ratings=30 → combined = (25×0.6) + (30×0.4) = **27**

**Result**: ✅ Correct ranking (A > B > C)

---

### Scenario 2: Votes Dominant
**Setup**:
- 2 candidates
- Candidate A: 100 votes, 0 ratings
- Candidate B: 50 votes, 300 ratings (10 judges × 30)

**Calculation**:
- maxVotes = 100, maxRatings = 300
- A: votes=100, ratings=0 → combined = (100×0.6) + (0×0.4) = **60**
- B: votes=50, ratings=100 → combined = (50×0.6) + (100×0.4) = **70**

**Result**: ✅ Correct - B wins despite fewer votes (ratings matter)

---

### Scenario 3: Ratings Dominant
**Setup**:
- 2 candidates
- Candidate A: 0 votes, 300 ratings (10 judges × 30)
- Candidate B: 100 votes, 0 ratings

**Calculation**:
- maxVotes = 100, maxRatings = 300
- A: votes=0, ratings=100 → combined = (0×0.6) + (100×0.4) = **40**
- B: votes=100, ratings=0 → combined = (100×0.6) + (0×0.4) = **60**

**Result**: ✅ Correct - B wins (votes have 60% weight)

---

### Scenario 4: All Zero Values
**Setup**:
- 3 candidates, all with 0 votes and 0 ratings

**Calculation**:
- maxVotes = 1 (fallback), maxRatings = 1 (fallback)
- All: votes=0, ratings=0 → combined = (0×0.6) + (0×0.4) = **0**

**Result**: ✅ Correct - all tied at 0

---

### Scenario 5: Single Candidate
**Setup**:
- 1 candidate with 5 votes and 15 ratings

**Calculation**:
- maxVotes = 5, maxRatings = 15
- Combined = (100×0.6) + (100×0.4) = **100**

**Result**: ⚠️ Mathematically correct but not meaningful (always 100)

---

### Scenario 6: Uneven Judge Participation
**Setup**:
- 2 candidates
- Candidate A: 50 votes, 90 ratings (3 judges × 30)
- Candidate B: 50 votes, 300 ratings (10 judges × 30)

**Calculation**:
- maxVotes = 50, maxRatings = 300
- A: votes=100, ratings=30 → combined = (100×0.6) + (30×0.4) = **72**
- B: votes=100, ratings=100 → combined = (100×0.6) + (100×0.4) = **100**

**Result**: ✅ Correct - B wins (more judges = more total rating points)

**Note**: This is expected behavior - more judges contributing ratings increases total rating points.

---

### Scenario 7: Gender-Separated Normalization (Leaderboard)
**Setup** (using `getWithStatsForLeaderboard`):
- Male candidates: A (200 votes, 0 ratings), B (100 votes, 0 ratings)
- Female candidates: C (50 votes, 0 ratings), D (25 votes, 0 ratings)

**Calculation**:
- **Males normalized separately**:
  - maxVotes = 200 (males only)
  - A: votes=100 → combined = (100×0.6) + (0×0.4) = **60**
  - B: votes=50 → combined = (50×0.6) + (0×0.4) = **30**

- **Females normalized separately**:
  - maxVotes = 50 (females only)
  - C: votes=100 → combined = (100×0.6) + (0×0.4) = **60**
  - D: votes=50 → combined = (50×0.6) + (0×0.4) = **30**

**Final Ranking** (combined):
1. A (male): 60
2. C (female): 60
3. B (male): 30
4. D (female): 30

**Result**: ⚠️ **POTENTIAL ISSUE** - C (50 votes) ties with A (200 votes) due to separate normalization

**Note**: This may be intentional to ensure fair competition within each gender, but scores are not directly comparable when genders are combined.

---

## Recommendations Summary

### High Priority
**None** - Current implementation is sound

### Medium Priority
1. **Review gender-separated normalization** - Clarify if separate normalization for males/females is intended in leaderboard
2. **Document normalization behavior** - Clarify that normalization rewards excellence in either category
3. **Handle single-candidate edge case** - Consider if this scenario should be allowed or documented
4. **Add rating validation** - Validate max rating (30) in backend for safety

### Low Priority
4. **Consider integer scores** - Round combined scores if integer display is desired
5. **Add logging** - Log score calculations for debugging (optional)
6. **Document edge cases** - Add comments explaining fallback behavior

---

## Conclusion

The score calculation logic is **mathematically sound and correctly implemented**. The previous scaling issue has been **fixed** - ratings are now stored raw and normalized properly.

### Strengths:
- ✅ Centralized calculation logic (DRY principle)
- ✅ Proper normalization to 0-100 scale
- ✅ Correct weighted combination (60/40 split)
- ✅ Handles edge cases (zero values, missing records)
- ✅ No division by zero issues

### Areas for Improvement:
- 🟡 Document normalization behavior (rewards excellence in either category)
- 🟡 Consider single-candidate edge case handling
- 🟢 Add optional validation for max rating

### Overall Assessment: ✅ **PRODUCTION READY**

The implementation is correct and ready for use. The identified issues are minor edge cases or documentation improvements, not critical bugs.

