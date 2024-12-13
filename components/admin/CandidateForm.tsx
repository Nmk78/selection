"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultiImageUploader } from "../MultiImageUploader";
import { ImageUploader } from "../ImageUploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCandidate } from "@/actions/candidate";
import { getActiveMetadata } from "@/actions/metadata";

interface CandidateFormProps {
  closeModal: () => void;
}

export default function CandidateForm({ closeModal }: CandidateFormProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<{
    name: string;
    gender: "male" | "female"; // Union type
    major: string;
    age: string; // Still a string because it's captured from input
    height: string; // Still a string because it's captured from input
    weight: string; // Same reason
    intro: string;
    hobbies: string[];
    profileImage: string | null; // Nullable until set
    carouselImages: string[]; // Array of strings
  }>({
    name: "",
    gender: "male", // Default value
    major: "",
    age: "",
    height: "",
    weight: "",
    intro: "",
    hobbies: [],
    profileImage: null,
    carouselImages: [],
  });

  const [newHobby, setNewHobby] = useState("");
  const [loading, setLoading] = useState(false)
  const profileImageUploaderRef = useRef(null);
  const uploaderRef = useRef(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddHobby = () => {
    if (newHobby.trim()) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()],
      }));
      setNewHobby("");
    }
  };

  const handleRemoveHobby = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index),
    }));
  };

  const { mutate } = useMutation({
    mutationFn: async (formData: {
      name: string;
      gender: "male" | "female";
      major: string;
      age: number;
      height: number;
      weight: number;
      intro: string;
      hobbies: string[];
      profileImage: string; // Adjust as per your backend requirements
      carouselImages: string[]; // Adjust as per your backend requirements
      roomId: string;
    }) => {
      // Your API call for adding metadata
      setLoading(true)
      await createCandidate(formData);
    },
    onSuccess: () => {
      // Show success toast notification
      setLoading(false)
      toast({
        title: "Success",
        description: "Candidate saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
    onError: (err: { message: any }) => {
      // Show error toast notification
      setLoading(false)
      toast({
        title: "Error",
        description: err?.message || "Failed to save candidate.",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    console.log("✅✅✅✅ Form Submitting");

    if (!uploaderRef.current || !profileImageUploaderRef.current) {
      console.error(
        "Uploader refs are not set. Ensure uploaderRef and profileImageUploaderRef are properly assigned."
      );
      return;
    }

    console.log("Preparing to upload images...");

    try {
      // Upload profile image
      //@ts-ignore
      const profileRes = await profileImageUploaderRef.current.startUpload();
      // Upload additional images
      //@ts-ignore
      const imgRes = await uploaderRef.current.startUpload();
      
      if (!profileRes || profileRes.length === 0) {
        toast({
          title: "Error",
          description: "Failed to upload profile image. Please try again.",
        });
        return;
      }

      if (!imgRes || imgRes.length === 0) {
        toast({
          title: "Error",
          description: "Failed to upload additional images. Please try again.",
        });
        return;
      }

      // Fetch currently active room metadata
      const currentlyActiveRoom = await getActiveMetadata();
      if (!currentlyActiveRoom || currentlyActiveRoom.length === 0) {
        toast({
          title: "Error",
          description: "No active room found. Please check and try again.",
        });
        return;
      }

      // Submit data via mutation
      mutate({
        ...formData,
        age: parseInt(formData.age, 10), // Convert to number
        height: parseInt(formData.height, 10), // Convert to number
        weight: parseInt(formData.weight, 10), // Convert to number
        profileImage: profileRes[0].url,
        carouselImages: imgRes.map((image: { url: string }) => image.url),
        roomId: currentlyActiveRoom[0].id,
      });

      console.log(
        "🚀 Submission Successful ~ ProfileRes:",
        profileRes,
        "ImgRes:",
        imgRes
      );

      setLoading(false)

      // Close modal and reset form
      closeModal();
      setFormData({
        name: "",
        gender: "male",
        major: "",
        age: "",
        height: "",
        weight: "",
        intro: "",
        hobbies: [],
        profileImage: null,
        carouselImages: [],
      });
      setNewHobby("");
    } catch (error) {
      setLoading(false)
      console.error("Image upload failed:", error);
      toast({
        title: "Error",
        description: "An error occurred during image upload. Please try again.",
      });
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full h-[550px] overflow-y-scroll scroll-area space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="gender">Gender</Label>
              <RadioGroup
                name="gender"
                value={formData.gender}
                onValueChange={(value) => {
                  if (value === "male" || value === "female") {
                    setFormData((prev) => ({ ...prev, gender: value }));
                  } else {
                    console.error("Invalid gender value:", value);
                  }
                }}
                required
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

            <div className="space-y-2">
              <Label htmlFor="height">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="16"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                min="0"
                value={formData.height}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
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
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro">Introduction</Label>
            <Textarea
              id="intro"
              name="intro"
              value={formData.intro}
              onChange={handleInputChange}
              required
              rows={4}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hobbies">Hobbies</Label>
            <div className="flex space-x-2">
              <Input
                id="newHobby"
                name="newHobby"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="Enter a hobby"
              />
              <Button type="button" onClick={handleAddHobby}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.hobbies.map((hobby, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {hobby}
                  <button
                    type="button"
                    onClick={() => handleRemoveHobby(index)}
                    className="ml-2 text-xs font-bold"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profilePic">Profile Picture</Label>
            <ImageUploader ref={profileImageUploaderRef} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalImages">Additional Images</Label>
            <MultiImageUploader ref={uploaderRef} />
          </div>
        </div>
        <Button disabled={loading} type="submit" className="w-full lg:col-span-2 mt-0">
          {loading ? "Submitting" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
