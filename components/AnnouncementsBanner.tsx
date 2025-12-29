"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

type AnnouncementType = "info" | "important" | "warning" | "success";

const getBannerStyles = (type: AnnouncementType): string => {
  switch (type) {
    case "important":
      return "bg-announcement-important text-white";
    case "warning":
      return "bg-announcement-warning text-white";
    case "success":
      return "bg-announcement-success text-white";
    case "info":
    default:
      return "bg-announcement-info text-white";
  }
};

export default function AnnouncementsBanner() {
  const announcements = useQuery(api.announcements.getActive);

  if (!announcements || announcements.length === 0) {
    return null;
  }

  // Show only the first active announcement
  const currentAnnouncement = announcements[0];

  return (
    <StickyBanner
      key={currentAnnouncement._id}
      className={cn(
        "shadow-lg",
        getBannerStyles(currentAnnouncement.type as AnnouncementType)
      )}
      hideOnScroll={false}
    >
      <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto px-4">
        <Crown className="h-4 w-4 shrink-0 text-yellow-500" />
        <p className="text-sm font-medium text-center">
          {currentAnnouncement.message}
        </p>
      </div>
    </StickyBanner>
  );
}

