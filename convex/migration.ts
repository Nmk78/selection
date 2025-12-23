import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { generateSlug } from "./help";

// Helpers to normalize Mongo Extended JSON (`$oid`, `$numberLong`)
function getString(val: any): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && "$oid" in val) return String(val.$oid);
  return String(val);
}

function getNumber(val: any): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "string") return Number(val);
  if (typeof val === "object" && "$numberLong" in val) return Number(val.$numberLong);
  return Number(val);
}

type LegacyCandidate = {
  name: string;
  intro: string;
  gender: "male" | "female" | string;
  major: string;
  profileImage: string;
  carouselImages: any;
  height: any;
  age: any;
  weight: any;
  hobbies: any;
};


export const migrateCandidates = mutation({
  args: {
    docs: v.array(v.any()),
  },
  handler: async (ctx, { docs }) => {
    // Get the currently active room
    const activeRooms = await ctx.db.query("metadata").withIndex("by_active", (q) => q.eq("active", true)).collect();
    if (activeRooms.length === 0) throw new Error("No active room found.");
    const activeRoomId = activeRooms[0]._id;

    let migratedCount = 0;

    for (const raw of docs as LegacyCandidate[]) {
      const gender = raw.gender === "male" || raw.gender === "female" ? raw.gender : "female";

      const carouselImages = Array.isArray(raw.carouselImages)
        ? raw.carouselImages.map(getString)
        : [];

      const hobbies = Array.isArray(raw.hobbies)
        ? raw.hobbies.map(getString)
        : [];

      await ctx.db.insert("candidates", {
        roomId: activeRoomId,
        name: getString(raw.name),
        slug: generateSlug(getString(raw.name)),
        intro: getString(raw.intro),
        gender,
        major: getString(raw.major),
        profileImage: getString(raw.profileImage),
        carouselImages,
        height: getNumber(raw.height),
        age: getNumber(raw.age),
        weight: getNumber(raw.weight),
        hobbies,
      });

      migratedCount += 1;
    }

    return { migratedCount };
  },
});

// Migration script to add slugs to all existing candidates
export const addSlugsToCandidates = mutation({
  handler: async (ctx) => {
    // Get all candidates
    const allCandidates = await ctx.db.query("candidates").collect();
    
    // Collect all existing slugs to avoid duplicates
    const existingSlugs = new Set<string>();
    for (const candidate of allCandidates) {
      if (candidate.slug) {
        existingSlugs.add(candidate.slug);
      }
    }
    
    let updatedCount = 0;
    const assignedSlugs = new Set<string>(); // Track slugs assigned in this batch

    for (const candidate of allCandidates) {
      // Skip if slug already exists
      if (candidate.slug) {
        continue;
      }

      // Generate base slug from name
      let baseSlug = generateSlug(candidate.name);
      
      // Handle empty slug (edge case where name has no valid characters)
      if (!baseSlug) {
        baseSlug = `candidate-${candidate._id}`;
      }

      // Check for duplicates and append number if needed
      let finalSlug = baseSlug;
      let counter = 1;
      
      // Check if slug is already used (either existing or assigned in this batch)
      while (existingSlugs.has(finalSlug) || assignedSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Mark this slug as assigned
      assignedSlugs.add(finalSlug);

      // Update candidate with slug
      await ctx.db.patch(candidate._id, {
        slug: finalSlug,
      });

      updatedCount += 1;
    }

    return { 
      updatedCount,
      totalCandidates: allCandidates.length,
    };
  },
});
