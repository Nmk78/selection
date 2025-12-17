"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Trash2, Check, Mail, Shield, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Id } from "@/convex/_generated/dataModel";

export default function InviteManager() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [isLoading, setIsLoading] = useState(false);

  const invites = useQuery(api.users.getInvites);
  const createInvite = useMutation(api.users.createInvite);
  const deleteInvite = useMutation(api.users.deleteInvite);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await createInvite({ email, role });
      setEmail("");
      toast({
        title: "Invite Created",
        description: `Invite created for ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvite = async (inviteId: Id<"invites">) => {
    try {
      await deleteInvite({ inviteId });
      toast({
        title: "Invite Deleted",
        description: "The invite has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete invite",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full">
      <div className="space-y-4">
        <form onSubmit={handleCreateInvite} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                role === "user"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                  : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
              }`}
            >
              <User className="w-4 h-4" />
              User
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                role === "admin"
                  ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                  : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Invite
              </>
            )}
          </Button>
        </form>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">
            Invites ({invites?.length || 0})
          </p>
          <ScrollArea className="h-[120px]">
            {invites === undefined ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : invites.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No invites yet
              </p>
            ) : (
              <div className="space-y-2">
                {invites.map((invite) => (
                  <div
                    key={invite._id}
                    className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                      invite.used ? "bg-green-50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {invite.used && <Check className="w-4 h-4 text-green-600 shrink-0" />}
                      <span className="truncate text-xs">{invite.email}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        invite.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {invite.role}
                      </span>
                    </div>
                    {!invite.used && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteInvite(invite._id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
