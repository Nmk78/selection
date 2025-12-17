"use client";

import { useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Crown, Archive, Plus, Edit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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
} from "../ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Define the Metadata type based on the schema
interface Metadata {
  _id: Id<"metadata">;
  title: string;
  active: boolean;
  description: string;
  maleForSecondRound: number;
  femaleForSecondRound: number;
  leaderBoardCandidates?: number;
  round: "preview" | "first" | "firstVotingClosed" | "secondPreview" | "second" | "secondVotingClosed" | "result";
  createdAt: number;
  updatedAt: number;
}

export default function ArchiveManager({
  classes,
  setMetaDataModal,
}: {
  classes?: string;
  setMetaDataModal: (param: boolean | null, archiveData?: Metadata | null) => void;
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const archives = useQuery(api.metadata.getAll);
  const setActive = useMutation(api.metadata.setActive);

  const isLoading = archives === undefined;

  const handleSetActive = async (id: Id<"metadata">) => {
    try {
      await setActive({ id });
      toast({ title: "Success", description: "Archive set active." });
    } catch (error) {
      console.error("Failed to set active metadata:", error);
      toast({ title: "Error", description: "Something went wrong!" });
    }
  };

  const handleEditClick = (archive: Metadata) => {
    // Pass the archive data to the parent component
    setMetaDataModal(true, archive);
  };

  return (
    <Card className={`w-full h-full ${classes}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Archives</span>
          <Button

            onClick={() => {
              setMetaDataModal(true);
            }}
            className="bg-transparent p-0 shadow-none hover:bg-transparent"
          >
            <Plus className="w-10 h-10 text-blue-800" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)] flex flex-col justify-start items-center">
        {isLoading ? (
          <div className="w-full space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3 p-1 mx-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : !archives || archives.length === 0 ? (
          <Button
            onClick={() => {
              setMetaDataModal(true);
            }}
            className="bg-transparent p-0 shadow-none hover:bg-transparent mt-20 text-center text-blue-600"
          >
            <span className="">Add new</span>
            <Plus className="w-20 h-20 text-blue-800" />
          </Button>
        ) : (
          <ScrollArea className="h-full w-full px-2" ref={scrollAreaRef}>
            {archives.map((archive) => (
              <div
                key={archive._id}
                className="flex items-center space-x-3 p-1 rounded-lg transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center justify-between w-full">
                  <AlertDialog>
                    <AlertDialogTrigger
                      disabled={archive.active}
                      className="w-auto h-auto p-0 m-0 flex space-x-2 items-center mx-4 py-1 flex-grow"
                    >
                      {archive.active ? (
                        <Crown className="w-5 h-5 text-Caccent flex-shrink-0" />
                      ) : (
                        <Archive className="w-5 h-5 text-Cprimary flex-shrink-0" />
                      )}
                      <Label
                        htmlFor={`archive-${archive.title}`}
                        className={`text-base flex-grow truncate overflow-hidden cursor-pointer ${
                          archive.active
                            ? "text-Caccent font-semibold"
                            : "text-Cprimary"
                        }`}
                      >
                        {typeof archive.title === "string"
                          ? archive.title.replace("_", " ").slice(0, 12)
                          : `${archive.title} Selection`}
                      </Label>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to set{" "}
                          <span className="font-bold text-Cprimary">
                            {archive.title}
                          </span>{" "}
                          as active with{" "}
                          <span className="font-bold text-Cprimary">
                            {archive.maleForSecondRound}
                          </span>{" "}
                          male candidate and{" "}
                          <span className="font-bold text-Cprimary">
                            {archive.femaleForSecondRound}
                          </span>{" "}
                          female candidate for the second round?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleSetActive(archive._id);
                          }}
                        >
                          Yes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(archive)}
                    className="p-1 h-auto"
                  >
                    <Edit className="w-4 h-4 ml-auto text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}