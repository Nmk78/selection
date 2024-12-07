"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

interface CandidateFormProps {
  onSubmit: (formData: FormData) => void;
}

export default function CandidateForm({ onSubmit }: CandidateFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    major: "",
    height: "",
    weight: "",
    intro: "",
    hobbies: "",
    profilePic: null as File | null,
    additionalImages: [] as File[],
  });

  const [previewUrls, setPreviewUrls] = useState({
    profilePic: "",
    additionalImages: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === "profilePic") {
        setFormData((prev) => ({ ...prev, profilePic: files[0] }));
        setPreviewUrls((prev) => ({
          ...prev,
          profilePic: URL.createObjectURL(files[0]),
        }));
      } else if (name === "additionalImages") {
        const fileArray = Array.from(files);
        setFormData((prev) => ({ ...prev, additionalImages: fileArray }));
        setPreviewUrls((prev) => ({
          ...prev,
          additionalImages: fileArray.map((file) => URL.createObjectURL(file)),
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "additionalImages") {
        (value as File[]).forEach((file) => {
          formDataToSend.append("additionalImages", file);
        });
      } else if (key === "profilePic" && value) {
        formDataToSend.append(key, value as File);
      } else {
        formDataToSend.append(key, value as string);
      }
    });

    onSubmit(formDataToSend);

    toast({
      title: "Candidate Added",
      description: `${formData.name} has been successfully added as a candidate.`,
    });

    // Reset form after submission
    setFormData({
      name: "",
      gender: "",
      major: "",
      height: "",
      weight: "",
      intro: "",
      hobbies: "",
      profilePic: null,
      additionalImages: [],
    });
    setPreviewUrls({
      profilePic: "",
      additionalImages: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <RadioGroup
            name="gender"
            value={formData.gender}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, gender: value }))
            }
            required
            aria-required="true"
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="major">Major</Label>
          <Input
            id="major"
            name="major"
            value={formData.major}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            name="height"
            type="number"
            min="0"
            value={formData.height}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="0.1"
            value={formData.weight}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="hobbies">Hobbies (comma-separated)</Label>
          <Input
            id="hobbies"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="intro">Introduction</Label>
        <Textarea
          id="intro"
          name="intro"
          value={formData.intro}
          onChange={handleInputChange}
          required
          aria-required="true"
          rows={4}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="profilePic">Profile Picture</Label>
          <Input
            id="profilePic"
            name="profilePic"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            aria-required="true"
          />
          {previewUrls.profilePic && (
            <div className="mt-2">
              <Image
                src={previewUrls.profilePic}
                alt="Profile picture preview"
                width={100}
                height={100}
                className="rounded-md"
              />
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="additionalImages">Additional Images</Label>
          <Input
            id="additionalImages"
            name="additionalImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {previewUrls.additionalImages.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {previewUrls.additionalImages.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Additional image preview ${index + 1}`}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full">Add Candidate</Button>
    </form>
  );
}

