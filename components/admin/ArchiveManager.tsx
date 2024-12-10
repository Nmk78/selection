"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Crown,
  Archive,
  Plus,
  MessageCircleHeart,
  LoaderIcon,
} from "lucide-react";
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
import { Span } from "next/dist/trace";
// import { getActiveMetadata } from "@/actions/metadata";

interface ArchiveYear {
  year: number | string;
}

export default function ArchiveManager({
  classes,
  setMetaDataModal,
}: {
  classes?: string;
  setMetaDataModal: (param: boolean) => void;
}) {
  // const [archives, setArchives] = useState<Metadata[] | undefined>([])
  const queryClient = useQueryClient();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    data: archives,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["metadata"], // Caching key
    queryFn: async () => {
      const response = getMetadata();
      console.log("🚀 ~ queryFn: ~ response:", response);
      return response;
    },
  });

  const { mutate: mutateSetActiveArchive } = useMutation({
    mutationFn: async (id: string) => {
      // Call the server-side function or API route with the given ID
      await setActiveMetadata(id); // Replace this with your actual API or server call
    },
    onSuccess: () => {
      // Invalidate and refetch "metadata" query
      queryClient.invalidateQueries({ queryKey: ["metadata"] });
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

  // useEffect(() => {
  //   const fetchAndScroll = async () => {
  //     const activeMetadata = await getActiveMetadata();
  //     setArchives(activeMetadata);

  //     if (scrollAreaRef.current) {
  //       const activeElement = scrollAreaRef.current.querySelector(
  //         `#archive-${activeYear}`
  //       );
  //       if (activeElement) {
  //         activeElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  //       }
  //     }
  //   };

  //   fetchAndScroll(); // Call the async function
  //   console.log("🚀 ~ archive:", archives)

  // }, [activeYear]);

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
        </CardTitle>{" "}
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]  flex flex-col justify-center items-center">
        {isLoading && (
          <LoaderIcon className=" animate-spin mt-20" width={40} height={40} />
        )}
        {error && (
          <span className="mt-20 text-center text-red-400">
            {error.message || "Something went wrong!"}
          </span>
        )}

        {archives?.length === 0 && (
          <Button
            onClick={() => setMetaDataModal(true)}
            className="bg-transparent p-0 shadow-none hover:bg-transparent mt-20 text-center text-blue-600"
          >
            <span className="">Add new</span>
            <Plus className="w-20 h-20 text-blue-800" />
          </Button>
        )}
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          {archives?.map((archive: Metadata) => (
            // {archives?.slice(0, 4).map((archive) => (
            <div
              key={archive.title}
              className="flex items-center space-x-3 p-1 rounded-lg transition-colors hover:bg-gray-100"
            >
              <AlertDialog>
                <AlertDialogTrigger disabled={archive.active} className="w-auto h-auto p-0 m-0 flex space-x-2 items-center mx-4 py-1">
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
                      Set{" "}
                      <span className="font-bold text-Cprimary">
                        {archive.title}
                      </span>{" "}
                      to active?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
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
      </CardContent>
    </Card>
  );
}
