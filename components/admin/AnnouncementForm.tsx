"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Edit, Plus, X } from "lucide-react";
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
    if (!message.trim()) return;

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
          title: "Announcement Updated",
          description: "The announcement has been updated successfully",
        });
      } else {
        await createAnnouncement({
          message: message.trim(),
          type,
          active,
        });
        toast({
          title: "Announcement Created",
          description: "The announcement has been created successfully",
        });
      }
      closeModal();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save announcement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Announcement message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
          rows={4}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          value={type}
          onChange={(e) =>
            setType(e.target.value as "info" | "important" | "warning" | "success")
          }
          disabled={isLoading}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="info">Info</option>
          <option value="important">Important</option>
          <option value="warning">Warning</option>
          <option value="success">Success</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={active}
            onCheckedChange={setActive}
            disabled={isLoading}
          />
          <Label htmlFor="active" className="cursor-pointer">
            Active
          </Label>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingId ? (
              <>
                <Edit className="w-4 h-4 mr-1" />
                Update
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Create
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

