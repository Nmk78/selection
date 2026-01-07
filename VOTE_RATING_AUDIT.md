# Vote and Rating Calculation Audit

## Overview
This audit examines how votes and ratings are calculated and combined in the voting system.

## Current Implementation

### 1. Vote Calculation (`convex/votes.ts` - `voteForCandidate`)
- **Mechanism**: Each student vote increments `totalVotes` by 1
- **Storage**: One vote record per candidate per room
- **Status**: ✅ **CORRECT** - Simple and straightforward

### 2. Rating Calculation (`convex/votes.ts` - `addRatings`)
- **Input**: Judges rate 3 categories (dressing, performance, QA) out of 10 each
- **Max per candidate**: 30 points (3 × 10)
- **Submission**: Sum is rounded: `Math.round(dressing + performance + QA)`
- **Scaling Formula**: `Math.round(rating / (keyCount / 2 || 1))`
  - `keyCount` = total number of special secret keys (judges) for the room
  - Example: With 10 judges, rating is divided by 5
  - Example: With 2 judges, rating is divided by 1

### 3. Combined Score Calculation (`convex/candidates.ts`)
- **Formula**: `combinedScore = totalVotes + totalRating`
- **Used in**: All ranking queries (getWithStats, getTopCandidates, getAll, etc.)
- **No normalization**: Direct addition without scaling

## Issues Identified

### 🔴 **CRITICAL ISSUE #1: Rating Scaling Formula is Backwards**

**Problem**: The scaling formula `rating / (keyCount / 2 || 1)` divides ratings by half the number of judges, which:
- Reduces the impact of ratings as more judges participate
- Doesn't achieve the intended "50% votes, 50% ratings" balance
- With 10 judges, a rating of 30 becomes 6 (30/5)
- With 2 judges, a rating of 30 becomes 30 (30/1)

**Expected Behavior**: 
- If the goal is 50/50 split, ratings should be normalized to match the scale of votes
- More judges should contribute more total rating points, not less

**Recommendation**: 
- Consider normalizing ratings to match vote scale, or
- Use a fixed multiplier instead of dividing by judge count

### 🔴 **CRITICAL ISSUE #2: No True 50/50 Split**

**Problem**: The comment states "50% votes, 50% ratings" but the implementation:
- Simply adds `totalVotes + totalRating` without normalization
- If votes are in the hundreds and ratings are scaled down, votes will dominate
- No mechanism ensures equal weight

**Example Scenario**:
- Candidate A: 100 votes, 20 totalRating → combinedScore = 120
- Candidate B: 50 votes, 50 totalRating → combinedScore = 100
- Votes dominate despite similar "weight" in the system

**Recommendation**:
- Normalize both values to 0-100 scale, then combine: `(normalizedVotes * 0.5) + (normalizedRatings * 0.5)`
- Or use a fixed multiplier to balance the scales

### 🟡 **MEDIUM ISSUE #3: Precision Loss**

**Problem**: Multiple rounding operations:
1. Frontend: `Math.round(dressing + performance + QA)` - rounds sum of 3 categories
2. Backend: `Math.round(rating / (keyCount / 2 || 1))` - rounds scaled rating

**Impact**: 
- Small differences in ratings may be lost
- Could affect tie-breaking scenarios

**Recommendation**: 
- Consider using decimal precision throughout, or
- Round only at the final combined score calculation

### 🟡 **MEDIUM ISSUE #4: Inconsistent Query Logic**

**Problem**: The same vote/rating calculation logic is duplicated across 8+ query functions:
- `getAll` (lines 44-54)
- `getWithStats` (lines 127-138)
- `getWithStatsForLeaderboard` (lines 182-207)
- `getWithStatsByRoomId` (lines 242-253)
- `getTopCandidates` (lines 287-298)
- `getTopCandidatesByRoomId` (lines 333-344)
- `getForSecondRound` (lines 389-400)
- `getForJudge` (lines 448-467)

**Impact**: 
- If calculation logic needs to change, it must be updated in 8+ places
- Risk of inconsistencies if one is missed

**Recommendation**: 
- Extract calculation logic into a helper function
- Reuse the helper across all queries

### 🟢 **MINOR ISSUE #5: Missing Validation**

**Problem**: No validation that:
- Ratings are within expected range (0-30 per candidate)
- Vote counts are non-negative
- Combined scores make sense

**Recommendation**: 
- Add validation in vote/rating mutations
- Add assertions in query functions for debugging

## Calculation Flow Diagram

```
Student Vote
    ↓
totalVotes += 1
    ↓
    └─→ combinedScore = totalVotes + totalRating

Judge Rating (3 categories × 10 points each)
    ↓
rating = Math.round(dressing + performance + QA)  [0-30]
    ↓
scaledRating = Math.round(rating / (keyCount / 2 || 1))
    ↓
totalRating += scaledRating
    ↓
    └─→ combinedScore = totalVotes + totalRating
```

## Recommendations Summary

### High Priority
1. **Fix rating scaling formula** - Current formula doesn't achieve 50/50 balance
2. **Implement proper normalization** - Ensure votes and ratings have equal weight

### Medium Priority
3. **Refactor duplicate calculation logic** - Extract to helper function
4. **Review precision requirements** - Decide on rounding strategy

### Low Priority
5. **Add validation** - Ensure data integrity
6. **Add unit tests** - Test calculation logic with various scenarios

## Example Scenarios

### Scenario 1: Current Behavior
- **10 judges**, each gives candidate 30/30
- Total raw rating: 300
- Scaled rating: 300 / 5 = 60
- **100 student votes**
- Combined score: 100 + 60 = 160

### Scenario 2: With 2 Judges
- **2 judges**, each gives candidate 30/30
- Total raw rating: 60
- Scaled rating: 60 / 1 = 60
- **100 student votes**
- Combined score: 100 + 60 = 160

**Observation**: Same combined score despite different number of judges, which may or may not be intended.

### Scenario 3: Vote Dominance
- **100 student votes**
- **2 judges**, scaled rating: 20
- Combined score: 100 + 20 = 120
- Votes contribute 83%, ratings contribute 17% (not 50/50)

