"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Edit, Plus, X, Save } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface AnnouncementFormProps {
  closeModal: () => void;
  editingId?: Id<"announcements"> | null;
  initialData?: {
    message: string;
    type: "info" | "important" | "warning" | "success";
    active: boolean;
  } | null;
}

export default function AnnouncementForm({
  closeModal,
  editingId,
  initialData,
}: AnnouncementFormProps) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "important" | "warning" | "success">("info");
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const createAnnouncement = useMutation(api.announcements.create);
  const updateAnnouncement = useMutation(api.announcements.update);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setMessage(initialData.message);
      setType(initialData.type);
      setActive(initialData.active);
    } else {
      setMessage("");
      setType("info");
      setActive(true);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: "Validation Error",
        description: "Message cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingId) {
        await updateAnnouncement({
          id: editingId,
          message: message.trim(),
          type,
          active,
        });
        toast({
          title: "Success",
          description: "Announcement updated successfully.",
        });
      } else {
        await createAnnouncement({
          message: message.trim(),
          type,
          active,
        });
        toast({
          title: "Success",
          description: "Announcement created successfully.",
        });
      }
      closeModal();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save announcement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "important":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Enter announcement message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
          rows={5}
          required
          className="w-full resize-none"
        />
        <p className="text-xs text-gray-500">
          {message.length} characters
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Type
          </Label>
          <select
            id="type"
            value={type}
            onChange={(e) =>
              setType(e.target.value as "info" | "important" | "warning" | "success")
            }
            disabled={isLoading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="info">Info</option>
            <option value="important">Important</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="active" className="text-sm font-medium">
            Status
          </Label>
          <div className="flex items-center space-x-3 h-10 px-3 rounded-md border bg-background">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
              disabled={isLoading}
            />
            <Label
              htmlFor="active"
              className="cursor-pointer text-sm font-normal"
            >
              {active ? "Active" : "Inactive"}
            </Label>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-lg border-2">
          <p className="text-xs font-medium text-gray-500 mb-2">Preview:</p>
          <div
            className={`p-3 rounded-md border ${getTypeColor(type)}`}
          >
            <p className="text-sm font-medium">{type.toUpperCase()}</p>
            <p className="text-sm mt-1">{message}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="flex-1 sm:flex-none sm:min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : editingId ? (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Update
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={isLoading}
          className="flex-1 sm:flex-none sm:min-w-[100px]"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
