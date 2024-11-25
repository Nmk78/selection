"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function CandidateForm({onSubmit}:any) {
  const [formData, setFormData] = useState({
    name: "",
    major: "",
    height: "",
    weight: "",
    intro: "",
    hobbies: "",
    profilePic: null as File | null,
    additionalImages: [] as File[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (name === "profilePic" && files && files[0]) {
      setFormData((prev) => ({ ...prev, profilePic: files[0] }));
    } else if (name === "additionalImages" && files) {
      setFormData((prev) => ({ ...prev, additionalImages: Array.from(files) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Submitting candidate data:", formData);
    toast({
      title: "Candidate Added",
      description: `${formData.name} has been successfully added as a candidate.`,
    });
    // Reset form after submission
    setFormData({
      name: "",
      major: "",
      height: "",
      weight: "",
      intro: "",
      hobbies: "",
      profilePic: null,
      additionalImages: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="major">Major</Label>
        <Input
          id="major"
          name="major"
          value={formData.major}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="flex justify-between gap-4">
        <div className="w-full">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="w-full">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="hobbies">Hobbies (comma-separated)</Label>
        <Input
          id="hobbies"
          name="hobbies"
          value={formData.hobbies}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="intro">Introduction</Label>
        <Textarea
          id="intro"
          name="intro"
          value={formData.intro}
          onChange={handleInputChange}
          required
        />
      </div>
        <div className="flex justify-between gap-4">
        <div>
        <Label htmlFor="profilePic">Profile Picture</Label>
        <Input
          id="profilePic"
          name="profilePic"
          type="file"
          onChange={handleFileChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="additionalImages">Additional Images</Label>
        <Input
          id="additionalImages"
          name="additionalImages"
          type="file"
          multiple
          onChange={handleFileChange}
        />
      </div>
        </div>
      <Button type="submit">Add Candidate</Button>
    </form>
  );
}
