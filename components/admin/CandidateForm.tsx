"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { MultiImageUploader } from "../MultiImageUploader";
import { ImageUploader } from "../ImageUploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateById,
  deleteImage,
} from "@/actions/candidate";
import { getActiveMetadata } from "@/actions/metadata";
import Image from "next/image";
import { X } from "lucide-react";

interface CandidateFormProps {
  closeModal: () => void;
  candidateId?: string; // Optional candidateId for edit mode
}

export default function CandidateForm({
  closeModal,
  candidateId,
}: CandidateFormProps) {
  const queryClient = useQueryClient();

  interface FormData {
    name: string;
    gender: "male" | "female";
    major: string;
    age: string;
    height: string;
    weight: string;
    intro: string;
    hobbies: string[];
    profileImage: string | null;
    carouselImages: string[];
  }
  const [formData, setFormData] = useState<FormData>({
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

  const [newHobby, setNewHobby] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const profileImageUploaderRef = useRef(null);
  const carouselImagesUploaderRef = useRef(null);

  const { mutate: createCandidateMutation } = useMutation({
    mutationFn: async () => {
      setLoading(true);
      await createNewCandidate();
    },
    onSuccess: () => {
      setLoading(false);
      toast({
        title: "Success",
        description: "Candidate saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      closeModal();
    },
    onError: (err: { message: string }) => { // Renamed _err to err
      console.error("🚀 ~ Error in createCandidateMutation:", err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to save candidate.",
      });
    },
  });
  
  const { mutate: editCandidateMutation } = useMutation({
    mutationFn: async () => {
      setLoading(true);
      await editCandidate();
    },
    onSuccess: () => {
      setLoading(false);
      toast({
        title: "Success",
        description: "Candidate edited successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      closeModal();
    },
    onError: (err: { message: string }) => { // Renamed _err to err
      console.error("🚀 ~ Error in editCandidateMutation:", err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to edit candidate.",
      });
    },
  });
  

  useEffect(() => {
    if (candidateId) {
      // Fetch the candidate data for editing if candidateId is provided
      // Example: Use a function to get the candidate data by ID
      // You would need to implement this function
      const fetchCandidate = async () => {
        setLoading(true);

        const candidate = await getCandidateById(candidateId);
        setFormData({
          name: candidate.name,
          gender: candidate.gender,
          major: candidate.major,
          age: String(candidate.age),
          height: String(candidate.height),
          weight: String(candidate.weight),
          intro: candidate.intro,
          hobbies: candidate.hobbies,
          profileImage: candidate.profileImage,
          carouselImages: candidate.carouselImages,
        });
      };
      fetchCandidate();
      setLoading(false);
    }
  }, [candidateId]);


  if (candidateId && !formData) return <p>Loading...</p>;

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

  const setProfileImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      profileImage: null,
    }));
  };

  const removeAdditionalImage = async (index: number) => {
    if (!candidateId) {
      return;
    }
    try {
      const imageToDelete = formData.carouselImages[index];

      // Perform the deletion
      const res = await deleteImage(imageToDelete, candidateId);
      // console.log("🚀 ~ deleteImage ~ res:", res);

      // Update state only after successful deletion
      if (res.success && res.deletedCount > 0) {
        toast({
          title: "Image Deleted",
          description: "Image successfully deleted",
        });
        setFormData((prev) => ({
          ...prev,
          carouselImages: prev.carouselImages.filter((_, i) => i !== index),
        }));
      } else {
        throw new Error("Failed to delete the image from the server.");
      }
    } catch (error) {
      console.error(`Failed to delete image at index ${index}:`, error);
    }
  };

  const removeProfileImage = async (url: string) => {
    if (!candidateId) {
      return;
    }
    try {
      const res = await deleteImage(url, candidateId);
      // console.log("🚀 ~ deleteImage ~ res:", res);

      // Update state only after successful deletion
      if (res.success && res.deletedCount > 0) {
        toast({
          title: "Image Deleted",
          description: "Profile image successfully deleted",
        });
        setFormData((prev) => ({
          ...prev,
          profileImage: null,
        }));
      } else {
        throw new Error("Failed to delete the image from the server.");
      }
    } catch (error) {
      console.error("Failed to delete profile image", error);
    }
  };



  const uploadProfileImage = async () => {
    try {
      if (!profileImageUploaderRef.current) {
        if (candidateId && formData.profileImage) {
          return null;
        } else {
          toast({
            title: "Failed",
            description: "Failed to upload profile image. Please try again.",
          });
          return null;
        }
      }
      console.log("Uploading profile image...");
      //@ts-expect-error //Hide red errors
      const profileRes = await profileImageUploaderRef.current.startUpload();
      console.log("Profile image upload response:", profileRes);

      if (!profileRes || profileRes.length === 0) {
        console.warn("Profile image upload failed.");
        toast({
          title: "Failed",
          description: "Profile image upload failed.",
        });
        return null; // Return null if upload fails
      }

      toast({
        title: "Succeeded",
        description: "Profile image uploaded.",
      });

      // Return the URL of the uploaded profile image
      return profileRes[0]?.url;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        title: "Error",
        description: "Error while uploading profile image.",
      });
      return null; // Return null if upload fails
    }
  };

  const uploadCarouselImages = async () => {
    try {
      // console.log(
      // "🚀 ~ uploadCarouselImages ~ carouselImagesUploaderRef.current:",
      // carouselImagesUploaderRef.current
      // );

      if (!carouselImagesUploaderRef.current) {
        if (candidateId) {
          console.log("Edit mode and no ref");
          return null;
        } else {
          toast({
            title: "Failed",
            description:
              "Failed to upload additional images. Please try again.",
          });
          return null;
        }
      }
      console.log("Uploading additional images...");
      //@ts-expect-error //Hide red errors
      const carouselRes = await carouselImagesUploaderRef.current.startUpload();
      console.log("Additional images upload response:", carouselRes);

      if (!carouselRes || carouselRes.length === 0) {
        console.warn("Additional image upload failed.");
        toast({
          title: "Failed",
          description: "Additional image upload failed.",
        });
        return []; // Return empty array if upload fails
      }

      toast({
        title: "Succeeded",
        description: "Additional images uploaded.",
      });

      return carouselRes.map((image: { url: string; }) => image.url);
    } catch (error) {
      console.error("Error uploading additional images:", error);
      toast({
        title: "Error",
        description: "Error while uploading additional images.",
      });
      return []; // Return empty array if upload fails
    }
  };

  const createNewCandidate = async () => {
    try {
      setLoading(true);
      const currentlyActiveRoom = await getActiveMetadata();
      console.log("Currently active room:", currentlyActiveRoom);

      if (!currentlyActiveRoom || currentlyActiveRoom.length === 0) {
        toast({ title: "Error", description: "No active room found." });
        console.error("No active room found");
        return;
      }
      // Upload the profile image and carousel images
      const profileImageUrl = await uploadProfileImage();
      const carouselImageUrls = await uploadCarouselImages();

      if (!profileImageUrl) {
        toast({
          title: "Failed",
          description: "Profile image is required.",
        });
        return;
      }

      if (carouselImageUrls.length === 0) {
        toast({
          title: "Failed",
          description: "At least one carousel image is required.",
        });
        return;
      }
      // Update formData with the uploaded image URLs
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        height: parseInt(formData.height, 10),
        weight: parseInt(formData.weight, 10),
        profileImage: profileImageUrl, // Ensure valid fallback
        carouselImages: carouselImageUrls,

        roomId: currentlyActiveRoom[0].id,
      };

      console.log("Updated payload:", payload);
      createCandidate(payload);
    } catch (error) {
      console.error("Error creating new candidate:", error);
      toast({
        title: "Error",
        description: "Error during candidate creation.",
      });
    }
  };

  const editCandidate = async () => {
    console.log("🛠️ Starting editCandidate function");
  
    try {
      setLoading(true);
      console.log("🔄 Loading state set to true");
  
      // Step 1: Fetch currently active room
      const currentlyActiveRoom = await getActiveMetadata();
      console.log("📂 Currently active room metadata fetched:", currentlyActiveRoom);
  
      if (!currentlyActiveRoom || currentlyActiveRoom.length === 0) {
        toast({ title: "Error", description: "No active room found." });
        console.error("❌ No active room found, stopping execution");
        setLoading(false);
        return;
      }
  
      // Step 2: Upload images
      const profileImageUrl = await uploadProfileImage();
      console.log("📸 Uploaded profile image URL:", profileImageUrl);

      const carouselImageUrls = await uploadCarouselImages();
      console.log("📸 Uploaded carousel image URLs:", carouselImageUrls);

      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        height: parseInt(formData.height, 10),
        weight: parseInt(formData.weight, 10),
        // profileImage: profileImageUrl, // Ensure valid fallback
        profileImage: profileImageUrl ? profileImageUrl : formData.profileImage,
        carouselImages:
          carouselImageUrls?.length > 0
            ? [...formData.carouselImages, ...carouselImageUrls]
            : formData.carouselImages,
        id: candidateId,
        roomId: currentlyActiveRoom[0].id,
      };

      if(!payload.profileImage || payload.carouselImages.length < 1){
        toast({ title: "Error", description: "Incomplete form!" });
        return
      }
  
      console.log("📝 Update payload prepared:", payload);
  
      // Step 4: Call updateCandidate function
      const res = await updateCandidate(payload);
      if(res.status === "success"){
        console.log("✅ Candidate updated successfully");
      }
    } catch (error) {
      console.error("❌ Error editing candidate:", error);
      toast({
        title: "Error",
        description: "Error while editing candidate.",
      });
    } finally {
      console.log("🔄 Setting loading state back to false");
      setLoading(false);
    }
  };
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      console.log("Form submission started");
      if (!candidateId) {
        createCandidateMutation(); // Use the hook outside of condition
      } else {
        editCandidateMutation(); // Use the hook outside of condition
      }
    } catch (error) {
      console.error("🚀 ~ handleSubmit ~ error:", error);
      toast({
        title: "Error",
        description: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async () => {
    if (!candidateId) return;

    try {
      setDeleteLoading(true);
      await deleteCandidate(candidateId);
      toast({
        title: "Deleted",
        description: "Candidate deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      closeModal();
    } catch (err) {
      console.log("🚀 ~ handleDelete ~ err:", err);
      toast({
        title: "Error",
        description: "Failed to delete candidate.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto">
      <form
        className="w-full h-[550px] overflow-y-scroll scroll-area grid grid-cols-1 lg:grid-cols-2 gap-6"
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
        <div className="space-y-4 mt-0">
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
              <Button size="sm" type="button" onClick={handleAddHobby}>
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

            {formData.profileImage ? (
              <div className="relative">
                <Image
                  src={formData.profileImage}
                  alt="Profile preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-40"
                />
                <button
                  onClick={() => removeProfileImage(formData.profileImage!)} // Non-null assertion
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <ImageUploader
                setProfileImage={setProfileImage}
                ref={profileImageUploaderRef}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalImages">Additional Images</Label>
            {formData.carouselImages.length < 10 && (
              <MultiImageUploader ref={carouselImagesUploaderRef} />
            )}
            {formData.carouselImages.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {formData.carouselImages.map((file, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={file}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover w-full h-40"
                      />
                      <button
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full lg:col-span-2 mt-0"
        >
          {loading ? "Submitting" : "Submit"}
        </Button>
        {candidateId && (
          <Button
            disabled={deleteLoading || loading}
            type="button"
            className="w-full lg:col-span-2 bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-red-700"
            onClick={handleDelete}
          >
            {deleteLoading ? "Deleting..." : "Delete Candidate"}
          </Button>
        )}
      </form>
    </div>
  );
}
