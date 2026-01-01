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
import { X, Loader2, Trash2, Save, Plus } from "lucide-react";
import { extractKeyFromUrl } from "@/lib/utils";

interface CandidateFormProps {
  closeModal: () => void;
  candidateId?: string;
}

// Helper function to delete images from UploadThing
async function deleteImageFromUploadThing(imageUrl: string) {
  const fileKey = extractKeyFromUrl(imageUrl);
  if (!fileKey) return; // Not an UploadThing URL, skip deletion

  try {
    const response = await fetch("/api/uploadthing/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileKeys: [fileKey] }),
    });

    if (!response.ok) {
      console.error("Failed to delete image from UploadThing");
    }
  } catch (error) {
    console.error("Error deleting image from UploadThing:", error);
  }
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

  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [newHobby, setNewHobby] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState<string | null>(null);
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
      const initialData = {
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
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [candidate]);

  if (candidateId && candidate === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
    const imageToDelete = formData.carouselImages[index];
    setImageDeleting(imageToDelete);

    try {
      // Delete from UploadThing
      await deleteImageFromUploadThing(imageToDelete);

      // Delete from database if editing existing candidate
      if (candidateId) {
        await removeImageMutation({
          candidateId: candidateId as Id<"candidates">,
          imageUrl: imageToDelete,
        });
      }

      setFormData((prev) => ({
        ...prev,
        carouselImages: prev.carouselImages.filter((_, i) => i !== index),
      }));

      toast({
        title: "Image Deleted",
        description: "Image successfully deleted",
      });
    } catch (error) {
      console.error(`Failed to delete image at index ${index}:`, error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImageDeleting(null);
    }
  };

  const removeProfileImage = async (url: string) => {
    setImageDeleting(url);

    try {
      // Delete from UploadThing
      await deleteImageFromUploadThing(url);

      // Delete from database if editing existing candidate
      if (candidateId) {
        await removeImageMutation({
          candidateId: candidateId as Id<"candidates">,
          imageUrl: url,
        });
      }

      setFormData((prev) => ({
        ...prev,
        profileImage: null,
      }));

      toast({
        title: "Image Deleted",
        description: "Profile image successfully deleted",
      });
    } catch (error) {
      console.error("Failed to delete profile image", error);
      toast({
        title: "Error",
        description: "Failed to delete profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImageDeleting(null);
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
            variant: "destructive",
          });
          return null;
        }
      }
      //@ts-expect-error
      const profileRes = await profileImageUploaderRef.current.startUpload();

      if (!profileRes || profileRes.length === 0) {
        toast({
          title: "Failed",
          description: "Profile image upload failed.",
          variant: "destructive",
        });
        return null;
      }

      return profileRes[0]?.url;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        title: "Error",
        description: "Error while uploading profile image.",
        variant: "destructive",
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
            variant: "destructive",
          });
          return null;
        }
      }
      //@ts-expect-error
      const carouselRes = await carouselImagesUploaderRef.current.startUpload();

      if (!carouselRes || carouselRes.length === 0) {
        toast({
          title: "Failed",
          description: "Additional image upload failed.",
          variant: "destructive",
        });
        return [];
      }

      return carouselRes.map((image: { url: string }) => image.url);
    } catch (error) {
      console.error("Error uploading additional images:", error);
      toast({
        title: "Error",
        description: "Error while uploading additional images.",
        variant: "destructive",
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
          toast({
            title: "Validation Error",
            description: "Profile image is required.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (!carouselImageUrls || carouselImageUrls.length === 0) {
          toast({
            title: "Validation Error",
            description: "At least one carousel image is required.",
            variant: "destructive",
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

        toast({
          title: "Success",
          description: "Candidate created successfully.",
        });
      } else {
        // Update existing candidate
        const finalProfileImage = profileImageUrl || formData.profileImage || "";
        const finalCarouselImages =
          carouselImageUrls && carouselImageUrls.length > 0
            ? [...formData.carouselImages, ...carouselImageUrls]
            : formData.carouselImages;

        if (!finalProfileImage || finalCarouselImages.length < 1) {
          toast({
            title: "Validation Error",
            description: "Profile image and at least one carousel image are required.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Delete old images that were replaced
        if (originalData) {
          const imagesToDelete: string[] = [];

          // Check if profile image was replaced
          if (
            originalData.profileImage &&
            originalData.profileImage !== finalProfileImage
          ) {
            imagesToDelete.push(originalData.profileImage);
          }

          // Check for removed carousel images
          const removedCarouselImages = originalData.carouselImages.filter(
            (img) => !finalCarouselImages.includes(img)
          );
          imagesToDelete.push(...removedCarouselImages);

          // Delete all old images from UploadThing
          await Promise.all(
            imagesToDelete.map((url) => deleteImageFromUploadThing(url))
          );
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

        toast({
          title: "Success",
          description: "Candidate updated successfully.",
        });
      }

      closeModal();
    } catch (error) {
      console.error("Error saving candidate:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!candidateId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this candidate? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      // Delete all images from UploadThing
      const imagesToDelete: string[] = [];
      if (formData.profileImage) imagesToDelete.push(formData.profileImage);
      imagesToDelete.push(...formData.carouselImages);

      await Promise.all(
        imagesToDelete.map((url) => deleteImageFromUploadThing(url))
      );

      await deleteCandidateMutation({ id: candidateId as Id<"candidates"> });
      toast({
        title: "Success",
        description: "Candidate deleted successfully.",
      });
      closeModal();
    } catch (err) {
      console.error("handleDelete error:", err);
      toast({
        title: "Error",
        description: "Failed to delete candidate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-h-[70vh] overflow-y-auto pr-2 space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full"
                placeholder="Enter candidate name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="major" className="text-sm font-medium">
                Major <span className="text-red-500">*</span>
              </Label>
              <Input
                id="major"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full"
                placeholder="Enter major"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) => {
                    if (value === "male" || value === "female") {
                      setFormData((prev) => ({ ...prev, gender: value }));
                    }
                  }}
                  disabled={loading}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">
                      Female
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="16"
                  max="100"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full"
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium">
                  Height (cm) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  min="0"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full"
                  placeholder="Height"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium">
                  Weight (lb) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full"
                  placeholder="Weight"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intro" className="text-sm font-medium">
                Introduction <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="intro"
                name="intro"
                value={formData.intro}
                onChange={handleInputChange}
                required
                disabled={loading}
                rows={5}
                className="w-full resize-none"
                placeholder="Write a brief introduction..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies" className="text-sm font-medium">
                Hobbies
              </Label>
              <div className="flex gap-2">
                <Input
                  id="newHobby"
                  name="newHobby"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddHobby();
                    }
                  }}
                  disabled={loading}
                  placeholder="Enter a hobby"
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddHobby}
                  disabled={loading || !newHobby.trim()}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.hobbies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.hobbies.map((hobby, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {hobby}
                      <button
                        type="button"
                        onClick={() => handleRemoveHobby(index)}
                        disabled={loading}
                        className="ml-2 hover:text-red-500 transition-colors"
                        aria-label={`Remove ${hobby}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="profilePic" className="text-sm font-medium">
                Profile Picture <span className="text-red-500">*</span>
              </Label>
              {formData.profileImage ? (
                <div className="relative group">
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={formData.profileImage}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                    {imageDeleting === formData.profileImage && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeProfileImage(formData.profileImage!)}
                    disabled={loading || imageDeleting === formData.profileImage}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <ImageUploader
                  setProfileImage={setProfileImage}
                  ref={profileImageUploaderRef}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalImages" className="text-sm font-medium">
                Additional Images{" "}
                <span className="text-gray-500 text-xs">
                  ({formData.carouselImages.length}/10)
                </span>
              </Label>
              {formData.carouselImages.length < 10 && (
                <MultiImageUploader ref={carouselImagesUploaderRef} />
              )}
              {formData.carouselImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {formData.carouselImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={file}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {imageDeleting === file && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        disabled={loading || imageDeleting === file}
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={loading || deleteLoading}
            className="flex-1 sm:flex-none sm:min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {candidateId ? "Update" : "Create"}
              </>
            )}
          </Button>
          {candidateId && (
            <Button
              type="button"
              disabled={loading || deleteLoading}
              variant="destructive"
              onClick={handleDelete}
              className="flex-1 sm:flex-none sm:min-w-[140px]"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Candidate
                </>
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={loading || deleteLoading}
            className="flex-1 sm:flex-none sm:min-w-[100px]"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
