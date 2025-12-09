"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CurrentResults from "@/components/admin/CurrentResult";
import RoundManager from "@/components/admin/RoundManager";
import SecretKeyManager from "@/components/admin/SecretKeyManager";
import SpecialKeyManager from "@/components/admin/SpecialKeyManager";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import CandidateManager from "@/components/admin/CandidateManager";
import ArchiveManager from "@/components/admin/ArchiveManager";
import MetadataForm from "@/components/admin/MetaDataForm";
import CandidateForm from "@/components/admin/CandidateForm";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/nextjs";
import SecretKeyPrintBtn from "@/components/admin/SecretKeyPrintBtn";

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

export default function AdminPage() {
  const [editModal, setEditModal] = useState<boolean | null>(null);
  const [activeModal, setActiveModal] = useState<boolean | null>(null);
  const [metaDataModal, setmetaDataModal] = useState<boolean | null>(null);
  const [editingMetadata, setEditingMetadata] = useState<Metadata | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [visable, setVisable] = useState<boolean>(false);
  const { userId } = useAuth();

  const closeModal = () => setActiveModal(null);
  const closeEditModal = () => setEditModal(null);
  const closeMetaDataModal = () => {
    setmetaDataModal(null);
    setEditingMetadata(null);
  };

  return (
    <div className="container max-w-7xl h-[82vh] mx-auto p-4 select-none">
      {!userId ||
        userId === undefined ||
        (userId === null && <Loader2 className="w-12 h-12" />)}
      {/* <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1> */}
      {/* <div className="grid grid-cols-1 md:grid-cols-7 grid-rows-8 gap-4 auto-rows-[minmax(100px,auto)]"> */}
      <div className="h-full flex flex-col md:flex-none md:grid grid-cols-1 md:grid-cols-7 md:grid-rows-8 gap-4 auto-rows-[minmax(100px,auto)] w-full">
        <Card className=" col-span-1 row-span-3 md:col-span-4 md:row-span-4">
          <CardHeader className="flex justify-between">
            <CardTitle className="flex justify-between">
              <span>Current Results</span>
              {visable ? (
                <EyeOff
                  onClick={() => {
                    setVisable(false);
                  }}
                  className="w-6
                  h-6"
                />
              ) : (
                <Eye
                  onClick={() => {
                    setVisable(true);
                  }}
                  className="w-6 h-6"
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentResults visible={visable} />
          </CardContent>
        </Card>
        <RoundManager />
        {/* <div className="flex md:col-span-3 row-span-4 md:row-span-5 gap-5"> */}
        <CandidateManager
          classes="h-full md:col-span-2 row-span-3 md:row-span-5"
          setActiveModal={setActiveModal}
          setEditModal={setEditModal}
          setCandidateId={setCandidateId}
        />
        <ArchiveManager
          setMetaDataModal={(param, archiveData) => {
            if (param === true) {
              // Adding new metadata or editing existing
              setEditingMetadata(archiveData || null);
              setmetaDataModal(true);
            } else {
              // Closing modal
              setmetaDataModal(null);
            }
          }}
          classes="h-full md:col-span-1 row-span-1 md:row-span-5"
        />{" "}
        {/* </div> */}
        <Card className="md:col-span-2 row-span-3 md:row-span-4">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Secret Keys</span>{" "}
              {userId && <SecretKeyPrintBtn userId={userId} />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userId ? (
              <SecretKeyManager userId={userId} />
            ) : (
              <div className="relative">
                {/* Skeleton Loader for the entire Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-md p-3 text-center cursor-pointer`}
                >
                  {/* Skeleton for the icon */}
                  <div className="mx-auto h-8 w-12 animate-pulse bg-gray-300"></div>

                  {/* Skeleton for instruction text */}
                  <p className="mt-2 text-gray-300 bg-gray-200 w-1/2 mx-auto h-4 animate-pulse"></p>

                  {/* Skeleton for error message */}
                  <p className="text-sm text-red-500 mt-1 bg-gray-200 w-2/3 mx-auto h-4 animate-pulse"></p>
                </div>
                {/* Skeleton for Progress Bar */}
                {/* Skeleton for Button */}
                <div className="mt-4 w-full h-10 bg-gray-300 rounded-md animate-pulse"></div>{" "}
                {/* Skeleton for button */}
              </div>
            )}
          </CardContent>
        </Card>
        {userId ? (
          <SpecialKeyManager userId={userId} />
        ) : (
          <Card className="md:col-span-2 row-span-3 md:row-span-4 ">
            <CardHeader>
              <CardTitle className="w-full flex justify-between items-center">
                <span>Judge Keys</span>
                <span className="w-10 h-5 animate-pulse bg-gray-200"></span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Skeleton Loader for the entire Upload Area */}
                {/* Skeleton for the icon */}
                <div className="mt-4 w-full h-14 bg-gray-300 rounded-md animate-pulse"></div>{" "}
                {/* Skeleton for instruction text */}
                {/* Skeleton for error message */}
                <div className="mt-4 w-full h-8 bg-gray-200 rounded-md border-gray-500 animate-pulse"></div>{" "}
                {/* Skeleton for Progress Bar */}
                {/* Skeleton for Button */}
                <div className="mt-4 w-full h-10 bg-gray-300 rounded-md animate-pulse"></div>{" "}
                {/* Skeleton for button */}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {activeModal && (
        <Modal title="Add New Candidate" onClose={closeModal}>
          <CandidateForm closeModal={closeModal} />
        </Modal>
      )}{" "}
      {editModal && candidateId && (
        <Modal title="Edit Candidate" onClose={closeEditModal}>
          <CandidateForm candidateId={candidateId} closeModal={closeModal} />
        </Modal>
      )}{" "}
      {metaDataModal && (
        <Modal title={editingMetadata ? "Edit Room" : "Add New Room"} onClose={closeMetaDataModal}>
          <MetadataForm 
            closeModal={closeMetaDataModal} 
            initialData={editingMetadata ? {
              _id: editingMetadata._id,
              title: editingMetadata.title,
              description: editingMetadata.description,
              maleForSecondRound: editingMetadata.maleForSecondRound,
              femaleForSecondRound: editingMetadata.femaleForSecondRound,
              leaderBoardCandidates: editingMetadata.leaderBoardCandidates ?? 5
            } : null}
          />
        </Modal>
      )}
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
    <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}