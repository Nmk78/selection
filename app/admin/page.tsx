"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CurrentResults from "@/components/admin/CurrentResult";
import RoundManager from "@/components/admin/RoundManager";
import SecretKeyManager from "@/components/admin/SecretKeyManager";
import SpecialKeyManager from "@/components/admin/SpecialKeyManager";
import InviteManager from "@/components/admin/InviteManager";
import AnnouncementsManager from "@/components/admin/AnnouncementsManager";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import AnnouncementsBanner from "@/components/AnnouncementsBanner";
import { Eye, EyeOff, Loader2, X, AlertTriangle, Plus } from "lucide-react";
import CandidateManager from "@/components/admin/CandidateManager";
import ArchiveManager from "@/components/admin/ArchiveManager";
import MetadataForm from "@/components/admin/MetaDataForm";
import CandidateForm from "@/components/admin/CandidateForm";
import { Id } from "@/convex/_generated/dataModel";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import SecretKeyPrintBtn from "@/components/admin/SecretKeyPrintBtn";
import { motion } from "framer-motion";

interface Metadata {
  _id: Id<"metadata">;
  title: string;
  active: boolean;
  description: string;
  maleForSecondRound: number;
  femaleForSecondRound: number;
  leaderBoardCandidates?: number;
  round:
    | "preview"
    | "first"
    | "firstVotingClosed"
    | "secondPreview"
    | "second"
    | "secondVotingClosed"
    | "result";
  createdAt: number;
  updatedAt: number;
}

function AdminContent() {
  const [editModal, setEditModal] = useState<boolean | null>(null);
  const [activeModal, setActiveModal] = useState<boolean | null>(null);
  const [metaDataModal, setmetaDataModal] = useState<boolean | null>(null);
  const [announcementModal, setAnnouncementModal] = useState<boolean | null>(null);
  const [editingMetadata, setEditingMetadata] = useState<Metadata | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<{
    _id: Id<"announcements">;
    message: string;
    type: "info" | "important" | "warning" | "success";
    active: boolean;
  } | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [visable, setVisable] = useState<boolean>(false);

  const user = useQuery(api.users.current);
  console.log("🚀 ~ AdminContent ~ user:", user);

  // return (<div>Admin</div>)

  const isAdmin = useQuery(api.users.isAdmin);

  const userId = user?._id;

  const closeModal = () => setActiveModal(null);
  const closeEditModal = () => setEditModal(null);
  const closeMetaDataModal = () => {
    setmetaDataModal(null);
    setEditingMetadata(null);
  };
  const closeAnnouncementModal = () => {
    setAnnouncementModal(null);
    setEditingAnnouncement(null);
  };

  // Loading state
  if (user === undefined || isAdmin === undefined) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 animate-spin text-Cprimary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Not admin - access denied
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl text-amber-800">
                Access Denied
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-amber-700">
                You don&apos;t have admin privileges. Please contact an
                administrator if you need access.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl min-h-[82vh] h-full max-h-[85vh] mx-auto p-4 select-none">
      {/* <AnnouncementsBanner /> */}
      <div className="h-full flex flex-col md:flex-none md:grid grid-cols-1 md:grid-cols-7 md:grid-rows-8 gap-4 auto-rows-[minmax(100px,auto)] w-full">
        <Card className="col-span-1 row-span-3 md:col-span-4 md:row-span-4 pb-0">
          <CardHeader className="flex justify-between">
            <CardTitle className="flex justify-between">
              <span>Current Results</span>
              {visable ? (
                <EyeOff
                  onClick={() => setVisable(false)}
                  className="w-6 h-6 cursor-pointer hover:text-Cprimary transition-colors"
                />
              ) : (
                <Eye
                  onClick={() => setVisable(true)}
                  className="w-6 h-6 cursor-pointer hover:text-Cprimary transition-colors"
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <CurrentResults visible={visable} />
          </CardContent>
        </Card>

        <RoundManager />

        <Card className="flex-1 min-h-[300px] md:flex-none md:h-full md:col-span-2 row-span-3 md:row-span-5 flex flex-col overflow-hidden">
          <Tabs
            defaultValue="candidates"
            className="flex-1 flex flex-col h-full"
          >
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-center">
                {/* <TabsList className="grid w-auto grid-cols-3"> */}
                <TabsList className="w-full h-10 px-4 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <TabsTrigger value="candidates" className="px-4 ml-10">
                    Candidates
                  </TabsTrigger>
                  <TabsTrigger value="invites" className="px-4">
                    Invites
                  </TabsTrigger>
                  <TabsTrigger value="announcements" className="px-4">
                    Announcements
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="candidates" className="mt-0 ml-4">
                  <Button
                    onClick={() => setActiveModal(true)}
                    size="sm"
                    className="bg-transparent p-0 shadow-none hover:bg-transparent"
                    aria-label="Add new candidate"
                  >
                    <Plus className="w-10 h-10 text-blue-800" />
                    {/* Add Candidate */}
                  </Button>
                </TabsContent>
                <TabsContent value="announcements" className="mt-0 ml-4">
                  <Button
                    onClick={() => {
                      setEditingAnnouncement(null);
                      setAnnouncementModal(true);
                    }}
                    size="sm"
                    className="bg-transparent p-0 shadow-none hover:bg-transparent"
                    aria-label="Add new announcement"
                  >
                    <Plus className="w-10 h-10 text-blue-800" />
                    {/* Add Announcement */}
                  </Button>
                </TabsContent>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-6">
              <TabsContent
                value="candidates"
                className="flex-1 mt-0 data-[state=active]:flex flex-col"
              >
                <CandidateManager
                  classes="h-full w-full"
                  setActiveModal={setActiveModal}
                  setEditModal={setEditModal}
                  setCandidateId={setCandidateId}
                />
              </TabsContent>
              <TabsContent
                value="invites"
                className="flex-1 mt-0 data-[state=active]:flex flex-col"
              >
                <InviteManager />
              </TabsContent>
              <TabsContent
                value="announcements"
                className="flex-1 mt-0 data-[state=active]:flex flex-col"
              >
                <AnnouncementsManager
                  onEdit={(announcement) => {
                    setEditingAnnouncement({
                      _id: announcement._id,
                      message: announcement.message,
                      type: announcement.type,
                      active: announcement.active,
                    });
                    setAnnouncementModal(true);
                  }}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <ArchiveManager
          setMetaDataModal={(param, archiveData) => {
            if (param === true) {
              setEditingMetadata(archiveData || null);
              setmetaDataModal(true);
            } else {
              setmetaDataModal(null);
            }
          }}
          classes="h-full md:col-span-1 row-span-1 md:row-span-5"
        />

        <Card className="md:col-span-2 row-span-3 md:row-span-4">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center justify-between">
              <span>Secret Keys</span>
              {userId && <SecretKeyPrintBtn userId={userId} />}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {userId ? <SecretKeyManager /> : <SkeletonLoader />}
          </CardContent>
        </Card>

        {userId ? (
          <SpecialKeyManager userId={userId} />
        ) : (
          <Card className="md:col-span-2 row-span-3 md:row-span-4">
            <CardHeader>
              <CardTitle className="w-full flex justify-between items-center">
                <span>Judge Keys</span>
                <span className="w-10 h-5 animate-pulse bg-gray-200 rounded"></span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SkeletonLoader />
            </CardContent>
          </Card>
        )}
      </div>

      {activeModal && (
        <Modal title="Add New Candidate" onClose={closeModal}>
          <CandidateForm closeModal={closeModal} />
        </Modal>
      )}

      {editModal && candidateId && (
        <Modal title="Edit Candidate" onClose={closeEditModal}>
          <CandidateForm candidateId={candidateId} closeModal={closeModal} />
        </Modal>
      )}

      {metaDataModal && (
        <Modal
          title={editingMetadata ? "Edit Room" : "Add New Room"}
          onClose={closeMetaDataModal}
        >
          <MetadataForm
            closeModal={closeMetaDataModal}
            initialData={
              editingMetadata
                ? {
                    _id: editingMetadata._id,
                    title: editingMetadata.title,
                    description: editingMetadata.description,
                    maleForSecondRound: editingMetadata.maleForSecondRound,
                    femaleForSecondRound: editingMetadata.femaleForSecondRound,
                    leaderBoardCandidates:
                      editingMetadata.leaderBoardCandidates ?? 5,
                  }
                : null
            }
          />
        </Modal>
      )}

      {announcementModal && (
        <Modal
          title={editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}
          onClose={closeAnnouncementModal}
        >
          <AnnouncementForm
            closeModal={closeAnnouncementModal}
            editingId={editingAnnouncement?._id || null}
            initialData={
              editingAnnouncement
                ? {
                    message: editingAnnouncement.message,
                    type: editingAnnouncement.type,
                    active: editingAnnouncement.active,
                  }
                : null
            }
          />
        </Modal>
      )}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="relative">
      <div className="border-2 border-dashed rounded-md p-3 text-center">
        <div className="mx-auto h-8 w-12 animate-pulse bg-gray-300 rounded"></div>
        <div className="mt-2 h-4 w-1/2 mx-auto animate-pulse bg-gray-200 rounded"></div>
        <div className="mt-1 h-4 w-2/3 mx-auto animate-pulse bg-gray-200 rounded"></div>
      </div>
      <div className="mt-4 w-full h-10 bg-gray-300 rounded-md animate-pulse"></div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <>
      <Authenticated>
        <AdminContent />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedRedirect />
      </Unauthenticated>
    </>
  );
}

function UnauthenticatedRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/signin");
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="w-12 h-12 animate-spin text-Cprimary" />
        <p className="text-muted-foreground">Redirecting to sign in...</p>
      </motion.div>
    </div>
  );
}

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ title, onClose, children }: ModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl w-fit max-w-3xl w-full shadow-2xl border border-candidate-male-500"
      >
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-semibold text-candidate-male-500">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}
