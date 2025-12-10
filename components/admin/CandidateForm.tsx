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
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { X } from "lucide-react";

interface CandidateFormProps {
  closeModal: () => void;
  candidateId?: string;
}

export default function CandidateForm({
  closeModal,
  candidateId,
}: CandidateFormProps) {
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

  // Convex queries and mutations
  const candidate = useQuery(
    api.candidates.getById,
    candidateId ? { id: candidateId as Id<"candidates"> } : "skip"
  );
  const createCandidateMutation = useMutation(api.candidates.create);
  const updateCandidateMutation = useMutation(api.candidates.update);
  const deleteCandidateMutation = useMutation(api.candidates.remove);
  const removeImageMutation = useMutation(api.candidates.removeImage);

  useEffect(() => {
    if (candidate) {
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
    }
  }, [candidate]);

  if (candidateId && candidate === undefined) return <p>Loading...</p>;

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
    if (!candidateId) return;

    try {
      const imageToDelete = formData.carouselImages[index];
      await removeImageMutation({
        candidateId: candidateId as Id<"candidates">,
        imageUrl: imageToDelete,
      });

      toast({
        title: "Image Deleted",
        description: "Image successfully deleted",
      });
      setFormData((prev) => ({
        ...prev,
        carouselImages: prev.carouselImages.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error(`Failed to delete image at index ${index}:`, error);
    }
  };

  const removeProfileImage = async (url: string) => {
    if (!candidateId) return;

    try {
      await removeImageMutation({
        candidateId: candidateId as Id<"candidates">,
        imageUrl: url,
      });

      toast({
        title: "Image Deleted",
        description: "Profile image successfully deleted",
      });
      setFormData((prev) => ({
        ...prev,
        profileImage: null,
      }));
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
      //@ts-expect-error //Hide red errors
      const profileRes = await profileImageUploaderRef.current.startUpload();

      if (!profileRes || profileRes.length === 0) {
        toast({
          title: "Failed",
          description: "Profile image upload failed.",
        });
        return null;
      }

      toast({
        title: "Succeeded",
        description: "Profile image uploaded.",
      });

      return profileRes[0]?.url;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        title: "Error",
        description: "Error while uploading profile image.",
      });
      return null;
    }
  };

  const uploadCarouselImages = async () => {
    try {
      if (!carouselImagesUploaderRef.current) {
        if (candidateId) {
          return null;
        } else {
          toast({
            title: "Failed",
            description: "Failed to upload additional images. Please try again.",
          });
          return null;
        }
      }
      //@ts-expect-error //Hide red errors
      const carouselRes = await carouselImagesUploaderRef.current.startUpload();

      if (!carouselRes || carouselRes.length === 0) {
        toast({
          title: "Failed",
          description: "Additional image upload failed.",
        });
        return [];
      }

      toast({
        title: "Succeeded",
        description: "Additional images uploaded.",
      });

      return carouselRes.map((image: { url: string }) => image.url);
    } catch (error) {
      console.error("Error uploading additional images:", error);
      toast({
        title: "Error",
        description: "Error while uploading additional images.",
      });
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileImageUrl = await uploadProfileImage();
      const carouselImageUrls = await uploadCarouselImages();

      if (!candidateId) {
        // Create new candidate
        if (!profileImageUrl) {
          toast({ title: "Failed", description: "Profile image is required." });
          setLoading(false);
          return;
        }

        if (!carouselImageUrls || carouselImageUrls.length === 0) {
          toast({
            title: "Failed",
            description: "At least one carousel image is required.",
          });
          setLoading(false);
          return;
        }

        await createCandidateMutation({
          name: formData.name,
          intro: formData.intro,
          gender: formData.gender,
          major: formData.major,
          profileImage: profileImageUrl,
          carouselImages: carouselImageUrls,
          height: parseInt(formData.height, 10),
          age: parseInt(formData.age, 10),
          weight: parseInt(formData.weight, 10),
          hobbies: formData.hobbies,
        });

        toast({ title: "Success", description: "Candidate saved successfully." });
      } else {
        // Update existing candidate
        const finalProfileImage = profileImageUrl || formData.profileImage || "";
        const finalCarouselImages =
          carouselImageUrls && carouselImageUrls.length > 0
            ? [...formData.carouselImages, ...carouselImageUrls]
            : formData.carouselImages;

        if (!finalProfileImage || finalCarouselImages.length < 1) {
          toast({ title: "Error", description: "Incomplete form!" });
          setLoading(false);
          return;
        }

        await updateCandidateMutation({
          id: candidateId as Id<"candidates">,
          name: formData.name,
          intro: formData.intro,
          gender: formData.gender,
          major: formData.major,
          profileImage: finalProfileImage,
          carouselImages: finalCarouselImages,
          height: parseInt(formData.height, 10),
          age: parseInt(formData.age, 10),
          weight: parseInt(formData.weight, 10),
          hobbies: formData.hobbies,
        });

        toast({ title: "Success", description: "Candidate edited successfully." });
      }

      closeModal();
    } catch (error) {
      console.error("Error saving candidate:", error);
      toast({ title: "Error", description: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!candidateId) return;

    try {
      setDeleteLoading(true);
      await deleteCandidateMutation({ id: candidateId as Id<"candidates"> });
      toast({ title: "Deleted", description: "Candidate deleted successfully." });
      closeModal();
    } catch (err) {
      console.error("handleDelete error:", err);
      toast({ title: "Error", description: "Failed to delete candidate." });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <form className="w-full h-[550px] overflow-y-scroll scroll-area grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <Label htmlFor="age">Age</Label>
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
              <Label htmlFor="weight">Weight (lb)</Label>
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
                    x
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
                  className="rounded-lg object-cover aspect-square w-40 h-40"
                />
                <button
                  onClick={() => removeProfileImage(formData.profileImage!)}
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
