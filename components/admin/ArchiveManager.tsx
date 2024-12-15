"use client";

import { useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Crown, Archive, Plus, LoaderIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { Metadata } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMetadata, setActiveMetadata } from "@/actions/metadata";
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
import { arch } from "os";

export default function ArchiveManager({
  classes,
  setMetaDataModal,
}: {
  classes?: string;
  setMetaDataModal: (param: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    data: archives = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["archive"],
    queryFn: async () => {
      const metadata = await getMetadata();
      return Array.isArray(metadata) ? metadata : [];
    },
  });

  const { mutate: mutateSetActiveArchive } = useMutation({
    mutationFn: async (id: string) => {
      await setActiveMetadata(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archive", "metadata"] });
      toast({ title: "Success", description: "Archive set active." });
    },
    onError: (error) => {
      console.error("Failed to set active metadata:", error);
      toast({ title: "Error", description: "Something went wrong!" });
    },
  });

  if (error) {
    console.error("🚀 ~ error:", error);
  }

  return (
    <Card className={`w-full h-full ${classes}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Archives</span>
          <Button
            onClick={() => setMetaDataModal(true)}
            className="bg-transparent p-0 shadow-none hover:bg-transparent"
          >
            <Plus className="w-20 h-20 text-blue-800" />
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
        ) : error ? (
          <span className="mt-20 text-center text-red-400">
            {error.message || "Something went wrong!"}
          </span>
        ) : archives.length === 0 ? (
          <Button
            onClick={() => setMetaDataModal(true)}
            className="bg-transparent p-0 shadow-none hover:bg-transparent mt-20 text-center text-blue-600"
          >
            <span className="">Add new</span>
            <Plus className="w-20 h-20 text-blue-800" />
          </Button>
        ) : (
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            {archives.map((archive: Metadata) => (
              <div
                key={archive.id}
                className="flex items-center space-x-3 p-1 rounded-lg transition-colors hover:bg-gray-100"
              >
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={archive.active}
                    className="w-auto h-auto p-0 m-0 flex space-x-2 items-center mx-4 py-1"
                  >
                    {archive.active ? (
                      <Crown className="w-5 h-5 text-Caccent flex-shrink-0" />
                    ) : (
                      <Archive className="w-5 h-5 text-Cprimary flex-shrink-0" />
                    )}
                    <Label
                      htmlFor={`archive-${archive.title}`}
                      className={`text-base flex-grow cursor-pointer ${
                        archive.active
                          ? "text-Caccent font-semibold"
                          : "text-Cprimary"
                      }`}
                    >
                      {typeof archive.title === "string"
                        ? archive.title.replace("_", " ")
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
                          mutateSetActiveArchive(archive.id);
                        }}
                      >
                        Yes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
