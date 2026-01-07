# Vote Calculation Logic Audit (Post-Refactoring)

## Overview
This audit examines the vote and rating calculation logic after the refactoring to use a centralized helper function.

## Current Flow

### 1. Vote Submission (`convex/votes.ts` - `voteForCandidate`)
**Location**: Lines 16-128

**Process**:
1. Student submits vote with secret key
2. System validates key and checks if already used for this gender/round
3. Finds or creates vote record
4. **Increments `totalVotes` by 1**

**Status**: ✅ **CORRECT** - Simple increment, no issues

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

---

### 2. Rating Submission (`convex/votes.ts` - `addRatings`)
**Location**: Lines 131-227

**Process**:
1. Judge rates 3 categories (dressing, performance, QA) - each 0-10
2. Frontend sums and rounds: `Math.round(dressing + performance + QA)` → **max 30**
3. Backend receives rating (0-30)
4. **⚠️ PROBLEM**: Backend scales rating: `Math.round(rating / (keyCount / 2 || 1))`
   - `keyCount` = total number of judge keys for the room
   - Example: 10 judges → rating divided by 5
   - Example: 2 judges → rating divided by 1
5. Stores scaled rating in `totalRating`

**Code** (Line 203):
```typescript
const scaledRating = Math.round(rating / (keyCount / 2 || 1));
```

**Status**: 🔴 **CRITICAL ISSUE** - Rating scaling is problematic

**Problems**:
1. **Inconsistent scaling**: More judges = less impact per judge
   - 10 judges: 30 → 6 (80% reduction)
   - 2 judges: 30 → 30 (no reduction)
2. **Double scaling**: Ratings are scaled here, then normalized again in helper function
3. **Unclear purpose**: The scaling doesn't align with the 60/40 ratio goal

---

### 3. Score Calculation (`convex/scoreCalculation.ts` - `calculateCandidateScores`)
**Location**: Lines 17-78

**Process**:
1. Receives candidates and vote records
2. Extracts `totalVotes` and `totalRating` from vote records
3. **Normalizes both to 0-100 scale** based on max values in the room
4. Applies weighted combination:
   - `voteWeight = (100 - RATING_WEIGHT_PERCENTAGE) / 100` (e.g., 0.6 for 60%)
   - `ratingWeight = RATING_WEIGHT_PERCENTAGE / 100` (e.g., 0.4 for 40%)
   - `combinedScore = (normalizedVotes × voteWeight) + (normalizedRatings × ratingWeight)`

**Code**:
```typescript
const maxVotes = Math.max(1, ...candidatesWithRawStats.map((c) => c.totalVotes));
const maxRatings = Math.max(1, ...candidatesWithRawStats.map((c) => c.totalRating));

const normalizedVotes = (totalVotes / maxVotes) * 100;
const normalizedRatings = (totalRating / maxRatings) * 100;

const combinedScore = normalizedVotes * voteWeight + normalizedRatings * ratingWeight;
```

**Status**: ✅ **CORRECT** - Proper normalization and weighting

**Configuration**:
- `RATING_WEIGHT_PERCENTAGE = 40` (40% ratings, 60% votes)
- Can be adjusted by changing the constant

---

## Issues Identified

### 🔴 **CRITICAL ISSUE #1: Double Scaling of Ratings**

**Problem**: Ratings are scaled twice:
1. **First scaling** (votes.ts line 203): `rating / (keyCount / 2 || 1)`
2. **Second scaling** (scoreCalculation.ts): Normalization to 0-100

**Impact**:
- Ratings are artificially reduced before normalization
- The normalization then works on already-distorted values
- Results in inconsistent weighting

**Example Scenario**:
- Judge gives rating of 30 (perfect score)
- 10 judges in room → scaled to 6
- If max rating in room is 6 → normalized to 100
- If max rating in room is 12 → normalized to 50
- **Inconsistent results depending on other judges' ratings**

**Recommendation**: 
- **Remove scaling from `addRatings` mutation**
- Store raw ratings (0-30) in database
- Let the helper function handle all normalization
- This ensures consistent 60/40 weighting regardless of judge count

---

### 🟡 **MEDIUM ISSUE #2: Edge Case - All Zero Values**

**Problem**: In `scoreCalculation.ts`, if all candidates have 0 votes or 0 ratings:
- `maxVotes = 1` (fallback to avoid division by zero)
- `maxRatings = 1` (fallback to avoid division by zero)
- All candidates get normalized to 0, which is correct
- But the fallback of 1 is arbitrary

**Impact**: 
- Low impact - only affects edge cases
- Results are still correct (all zeros normalize to 0)

**Recommendation**: 
- Current implementation is acceptable
- Could add explicit handling for "no votes yet" scenario

---

### 🟡 **MEDIUM ISSUE #3: Precision Loss in Rating Submission**

**Problem**: Multiple rounding operations:
1. Frontend: `Math.round(dressing + performance + QA)` - rounds sum
2. Backend: `Math.round(rating / (keyCount / 2 || 1))` - rounds scaled value

**Impact**:
- Small precision loss
- Could affect tie-breaking scenarios
- Less critical now with normalization

**Recommendation**:
- If removing scaling, only one rounding needed (frontend)
- Or use decimal precision throughout

---

### 🟢 **MINOR ISSUE #4: Comment Mismatch**

**Problem**: `votes.ts` still has comment saying "50% votes, 50% ratings" but:
- Helper function uses 40% ratings, 60% votes
- Comment is outdated

**Recommendation**: Update comment to reflect current ratio

---

## Data Flow Diagram

```
Student Vote
    ↓
totalVotes += 1
    ↓
    └─→ [Helper Function]
        └─→ Normalize to 0-100
        └─→ Apply 60% weight
        └─→ combinedScore

Judge Rating (3 categories × 10 each = 0-30)
    ↓
Frontend: Math.round(sum) → 0-30
    ↓
Backend: Math.round(rating / (keyCount/2 || 1)) ⚠️ PROBLEM
    ↓
totalRating += scaledRating
    ↓
    └─→ [Helper Function]
        └─→ Normalize to 0-100 (based on max scaled rating)
        └─→ Apply 40% weight
        └─→ combinedScore
```

---

## Recommendations Summary

### High Priority
1. **Remove rating scaling from `addRatings` mutation**
   - Store raw ratings (0-30) directly
   - Let helper function handle normalization
   - Ensures consistent 60/40 weighting

2. **Update comments** to reflect current 60/40 ratio

### Medium Priority
3. **Review precision requirements** - decide on rounding strategy
4. **Add validation** for edge cases (all zeros, etc.)

### Low Priority
5. **Consider adding logging** for debugging score calculations
6. **Document the normalization approach** for future maintainers

---

## Proposed Fix

### Change in `convex/votes.ts` (Line 203)

**Current**:
```typescript
const scaledRating = Math.round(rating / (keyCount / 2 || 1));
```

**Proposed**:
```typescript
// Store raw rating - normalization handled by calculateCandidateScores
const rawRating = rating;
```

**Then update**:
```typescript
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
```

**Benefits**:
- Consistent rating storage regardless of judge count
- Proper normalization in helper function
- True 60/40 weighting as intended
- Simpler logic

---

## Testing Scenarios

### Scenario 1: Current Behavior (With Scaling)
- **10 judges**, each gives candidate 30/30
- Total raw: 300
- Scaled: 300 / 5 = 60
- **100 student votes**
- Normalized votes: 100 / 100 = 100
- Normalized ratings: 60 / 60 = 100
- Combined: (100 × 0.6) + (100 × 0.4) = 100

### Scenario 2: Proposed Behavior (No Scaling)
- **10 judges**, each gives candidate 30/30
- Total raw: 300 (stored directly)
- **100 student votes**
- Normalized votes: 100 / 100 = 100
- Normalized ratings: 300 / 300 = 100
- Combined: (100 × 0.6) + (100 × 0.4) = 100

**Result**: Same outcome, but more consistent and predictable

### Scenario 3: Mixed Judge Counts (Current Problem)
- **Room A**: 10 judges, rating 30 → stored as 6
- **Room B**: 2 judges, rating 30 → stored as 30
- When normalized, Room B ratings have 5× more impact
- **Inconsistent weighting across rooms**

### Scenario 4: Mixed Judge Counts (Proposed Fix)
- **Room A**: 10 judges, rating 30 → stored as 30
- **Room B**: 2 judges, rating 30 → stored as 30
- When normalized, both have same relative impact
- **Consistent weighting across rooms**

---

## Conclusion

The helper function implementation is **correct and well-designed**. However, the **rating scaling in `addRatings` mutation should be removed** to ensure:
1. Consistent weighting regardless of judge count
2. Proper normalization working on raw data
3. True 60/40 split as configured

The vote calculation logic is sound, but the rating storage needs to be fixed.

