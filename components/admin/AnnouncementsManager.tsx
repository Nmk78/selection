"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Loader2,
  Trash2,
  Edit,
  History,
  ChevronUp,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Id } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Announcement {
  _id: Id<"announcements">;
  message: string;
  type: "info" | "important" | "warning" | "success";
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

interface AnnouncementsManagerProps {
  onEdit?: (announcement: Announcement) => void;
}

export default function AnnouncementsManager({ onEdit }: AnnouncementsManagerProps) {
  const [expandedHistory, setExpandedHistory] = useState<Id<"announcements"> | null>(null);

  const announcements = useQuery(api.announcements.getAll);
  const deleteAnnouncement = useMutation(api.announcements.remove);
  const updateAnnouncement = useMutation(api.announcements.update);
  
  // Get history for expanded announcement
  const history = useQuery(
    api.announcements.getHistory,
    expandedHistory ? { announcementId: expandedHistory } : "skip"
  );

  const handleEdit = (announcement: Announcement) => {
    if (onEdit) {
      onEdit(announcement);
    }
  };

  const handleDelete = async (id: Id<"announcements">) => {
    try {
      await deleteAnnouncement({ id });
      toast({
        title: "Announcement Deleted",
        description: "The announcement has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete announcement",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: Id<"announcements">, currentActive: boolean) => {
    try {
      await updateAnnouncement({
        id,
        active: !currentActive,
      });
      toast({
        title: "Status Updated",
        description: `Announcement ${!currentActive ? "activated" : "deactivated"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <p className="text-sm font-medium mb-2">
          Announcements ({announcements?.length || 0})
        </p>
        <ScrollArea className="flex-1 max-h-[20vh] md:max-h-[33vh] ">
          {announcements === undefined ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No announcements yet
            </p>
          ) : (
            <div className="space-y-2 py-3">
              {announcements.map((announcement) => (
                <Card
                  key={announcement._id}
                  className={`${
                    announcement.active
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          {announcement.message}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                            announcement.type === "important"
                              ? "bg-red-100 text-red-700"
                              : announcement.type === "warning"
                              ? "bg-amber-100 text-amber-700"
                              : announcement.type === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {announcement.type
                            ? announcement.type.charAt(0).toUpperCase() +
                              announcement.type.slice(1)
                            : "Info"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={announcement.active}
                          onCheckedChange={() =>
                            toggleActive(announcement._id, announcement.active)
                          }
                          // size="sm"
                        />
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            announcement.active
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {announcement.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          onClick={() =>
                            setExpandedHistory(
                              expandedHistory === announcement._id
                                ? null
                                : announcement._id
                            )
                          }
                          title="View history"
                        >
                          <History className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this announcement?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(announcement._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {expandedHistory === announcement._id && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Activation History
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => setExpandedHistory(null)}
                          >
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                        </div>
                        {history === undefined ? (
                          <div className="flex justify-center py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        ) : history.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            No history available
                          </p>
                        ) : (
                          <ScrollArea className="max-h-48">
                            <div className="space-y-1.5 pr-4">
                              {history.map((entry) => (
                                <div
                                  key={entry._id}
                                  className="flex items-center justify-between gap-2 text-xs p-2 rounded bg-muted/50 min-w-0"
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                                        entry.action === "activated"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {entry.action === "activated"
                                        ? "Activated"
                                        : "Deactivated"}
                                    </span>
                                    <span className="text-muted-foreground truncate">
                                      by {entry.userName}
                                    </span>
                                  </div>
                                  <span className="text-muted-foreground shrink-0 text-[10px]">
                                    {new Date(entry.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

