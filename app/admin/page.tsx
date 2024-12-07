"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CurrentResults from "@/components/admin/CurrentResult";
import RoundManager from "@/components/admin/RoundManager";
import SecretKeyManager from "@/components/admin/SecretKeyManager";
import SpecialKeyManager from "@/components/admin/SpecialKeyManager";
import CandidateForm from "@/components/admin/CandidateForm";
import { Eye, EyeClosed, EyeClosedIcon, EyeOff, Plus, X } from "lucide-react";
import CandidateManager from "@/components/admin/CandidateManager";
import ArchiveManager from "@/components/admin/ArchiveManager";
import MetadataForm from "@/components/admin/MetaDataForm";

export default function AdminPage() {
  const [activeModal, setActiveModal] = useState<boolean | null>(null);
  const [metaDataModal, setmetaDataModal] = useState<boolean | null>(null);
  const [visable, setVisable] = useState<boolean>(false);

  const closeModal = () => setActiveModal(null);
  const closeMetaDataModal = () => setmetaDataModal(null);

  return (
    <div className="container max-w-7xl h-[82vh] mx-auto p-4 select-none">
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
                  w-6
                  h-6
                />
              ) : (
                <Eye
                  onClick={() => {
                    setVisable(true);
                  }}
                  w-6
                  h-6
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentResults visible={visable} />
          </CardContent>
        </Card>
        <Card className="row-span-4 md:col-span-3 md:row-span-3">
          <CardHeader>
            <CardTitle>Selection Rounds</CardTitle>
          </CardHeader>
          <CardContent>
            <RoundManager />
          </CardContent>
        </Card>
        {/* <div className="flex md:col-span-3 row-span-4 md:row-span-5 gap-5"> */}
        <CandidateManager
          classes="h-full md:col-span-2 row-span-3 md:row-span-5"
          setActiveModal={setActiveModal}
        />
        <ArchiveManager setMetaDataModal={setmetaDataModal} classes="h-full md:col-span-1 row-span-1 md:row-span-5" />{" "}
        {/* </div> */}
        <Card className="md:col-span-2 row-span-3 md:row-span-4">
          <CardHeader>
            <CardTitle>Secret Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <SecretKeyManager />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 row-span-3 md:row-span-4">
          <CardHeader>
            <CardTitle>Judge Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <SpecialKeyManager />
          </CardContent>
        </Card>
      </div>
      {activeModal && (
        <Modal title="Add New Candidate" onClose={closeModal}>
          <CandidateForm onSubmit={closeModal} />
        </Modal>
      )}{" "}
      {metaDataModal && (
        <Modal title="Add New Candidate" onClose={closeMetaDataModal}>
          <MetadataForm closeModal={closeMetaDataModal} />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center p-4 border-b">
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
