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

  const [formData, setFormData] = useState<{
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
  }>({
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
  const uploaderRef = useRef(null);
  const [initialProfileImage, setInitialProfileImage] = useState<string | null>(
    formData.profileImage
  );
  const [initialCarouselImages, setInitialCarouselImages] = useState<string[]>(
    formData.carouselImages || []
  );

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
      setInitialProfileImage(formData.profileImage);
      setInitialCarouselImages(formData.carouselImages || []);
      setLoading(false);
    }
  }, [candidateId]);

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

  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      carouselImages: prev.carouselImages.filter((_, i) => i !== index),
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
      profileImage: string;
      carouselImages: string[];
      roomId: string;
    }) => {
      setLoading(true);
      if (candidateId) {
        await updateCandidate(candidateId, formData);
      } else {
        await createCandidate(formData);
      }
    },
    onSuccess: () => {
      setLoading(false);
      toast({
        title: "Success",
        description: candidateId
          ? "Candidate updated successfully."
          : "Candidate saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
    onError: (_err: { message: string }) => {
      console.log("🚀 ~ _err:", _err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to save candidate.",
      });
    },
  });

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!uploaderRef.current || !profileImageUploaderRef.current) {
  //     console.error(
  //       "Uploader refs are not set. Ensure uploaderRef and profileImageUploaderRef are properly assigned."
  //     );
  //     return;
  //   }

  //   try {
  //     if (!profileImageUploaderRef.current || !uploaderRef.current) {
  //       toast({
  //         title: "Error",
  //         description: "Image upload components are not available.",
  //       });
  //       return;
  //     }

  //     // Upload profile image
  //     //@ts-expect-error //it was showing error
  //     const profileRes = await profileImageUploaderRef.current.startUpload();
  //     // Upload additional images
  //     //@ts-expect-error //it was showing error
  //     const imgRes = await uploaderRef.current.startUpload();
  //     if (!profileRes || profileRes.length === 0) {
  //       toast({
  //         title: "Error",
  //         description: "Failed to upload profile image.",
  //       });
  //       return;
  //     }

  //     if (!imgRes || imgRes.length === 0) {
  //       toast({
  //         title: "Error",
  //         description: "Failed to upload additional images.",
  //       });
  //       return;
  //     }

  //     const currentlyActiveRoom = await getActiveMetadata();
  //     if (!currentlyActiveRoom || currentlyActiveRoom.length === 0) {
  //       toast({ title: "Error", description: "No active room found." });
  //       return;
  //     }

  //     mutate({
  //       ...formData,
  //       age: parseInt(formData.age, 10),
  //       height: parseInt(formData.height, 10),
  //       weight: parseInt(formData.weight, 10),
  //       profileImage: profileRes[0].url,
  //       carouselImages: imgRes.map((image: { url: string }) => image.url),
  //       roomId: currentlyActiveRoom[0].id,
  //     });
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Image upload failed:", error);
  //     toast({
  //       title: "Error",
  //       description: "An error occurred during image upload.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!uploaderRef.current || !profileImageUploaderRef.current) {
  //     console.error(
  //       "Uploader refs are not set. Ensure uploaderRef and profileImageUploaderRef are properly assigned."
  //     );
  //     return;
  //   }

  //   try {
  //     let profileRes = formData.profileImage;
  //     let imgRes = formData.carouselImages;

  //     // If profile image is being updated, upload the new one
  //     if (profileImageUploaderRef.current) {
  //       //@ts-expect-error //hide red-underlines
  //       profileRes = await profileImageUploaderRef.current.startUpload();
  //       if (!profileRes || profileRes.length === 0) {
  //         toast({
  //           title: "Error",
  //           description: "Failed to upload profile image.",
  //         });
  //         return;
  //       }
  //     }

  //     // If additional images are being updated, upload the new ones
  //     if (uploaderRef.current) {
  //       //@ts-expect-error //hide red-underlines
  //       imgRes = await uploaderRef.current.startUpload();
  //       if (!imgRes || imgRes.length === 0) {
  //         toast({
  //           title: "Error",
  //           description: "Failed to upload additional images.",
  //         });
  //         return;
  //       }
  //     }

  //     const currentlyActiveRoom = await getActiveMetadata();
  //     if (!currentlyActiveRoom || currentlyActiveRoom.length === 0) {
  //       toast({ title: "Error", description: "No active room found." });
  //       return;
  //     }

  //     mutate({
  //       ...formData,
  //       age: parseInt(formData.age, 10),
  //       height: parseInt(formData.height, 10),
  //       weight: parseInt(formData.weight, 10),
  //       profileImage: Array.isArray(profileRes)
  //         ? profileRes[0].url
  //         : profileRes,
  //       carouselImages: imgRes.map((image: string) => image),
  //       roomId: currentlyActiveRoom[0].id,
  //     });
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Image upload failed:", error);
  //     toast({
  //       title: "Error",
  //       description: "An error occurred during image upload.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const areArraysEqual = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    console.log(
      arr1 +
        "and" +
        arr2 +
        "are equal " +
        arr1.every((val, index) => val === arr2[index])
    );
    return arr1.every((val, index) => val === arr2[index]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Form submission started");

    if (!uploaderRef.current || !profileImageUploaderRef.current) {
      console.error(
        "Uploader refs are not set. Ensure uploaderRef and profileImageUploaderRef are properly assigned."
      );
      setLoading(false);
      return;
    }

    let profileRes = formData.profileImage; // Fallback to existing value
    let imgRes = formData.carouselImages; // Fallback to existing value

    console.log("Initial profile image:", profileRes);
    console.log("Initial carousel images:", imgRes);

    try {
      // Profile image upload
      try {
        if (profileImageUploaderRef.current && formData.profileImage === null) {
          console.log("Uploading profile image...");
          //@ts-expect-error //hide red-underlines
          profileRes = await profileImageUploaderRef.current.startUpload();
          console.log("Profile image upload response:", profileRes);

          if (!profileRes || profileRes.length === 0) {
            console.warn("Profile image upload failed, using fallback value");
            profileRes = formData.profileImage; // Fallback to existing value
          }
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
        profileRes = formData.profileImage; // Fallback to existing value
      }

      // Additional images upload
      try {
        if (
          uploaderRef.current &&
          !areArraysEqual(formData.carouselImages, initialCarouselImages)
        ) {
          console.log("Uploading additional images...");
          //@ts-expect-error //hide red-underlines
          imgRes = await uploaderRef.current.startUpload();
          console.log("Additional images upload response:", imgRes);

          if (!imgRes || imgRes.length === 0) {
            console.warn(
              "Additional image upload failed, using fallback value"
            );
            imgRes = formData.carouselImages; // Fallback to existing value
          }
        } else {
          console.log("Skipped additional images");
          imgRes = formData.carouselImages; // Fallback to existing value
        }
      } catch (error) {
        console.error("Error uploading additional images:", error);
        imgRes = formData.carouselImages; // Fallback to existing value
      }

      // Fetch metadata and ensure valid payload
      const currentlyActiveRoom = await getActiveMetadata();
      console.log("Currently active room:", currentlyActiveRoom);

      if (!currentlyActiveRoom || currentlyActiveRoom.length === 0) {
        toast({ title: "Error", description: "No active room found." });
        console.error("No active room found");
        return;
      }

      // Construct mutation payload
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        height: parseInt(formData.height, 10),
        weight: parseInt(formData.weight, 10),
        profileImage:
          profileRes && Array.isArray(profileRes)
            ? profileRes[0]?.url
            : profileRes || formData.profileImage, // Ensure valid fallback
        carouselImages: [
          ...(formData.carouselImages || []), // Retain existing images
          ...(imgRes.length > 0
            ? imgRes.map((image: any) =>
                typeof image === "string" ? image : image?.url
              ) // Add new images
            : []),
        ],

        roomId: currentlyActiveRoom[0].id,
      };
      console.log("🚀 ~ handleSubmit ~ imgRes:", imgRes);
      console.log("Final mutation payload:", payload);

      // Ensure payload validity
      if (!payload.profileImage || !payload.carouselImages) {
        console.error("Invalid mutation payload:", payload);
        toast({
          title: "Error",
          description: "Form submission data is incomplete.",
        });
        return;
      }

      mutate(payload);
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "Error",
        description: "An error occurred during the form submission.",
      });
    } finally {
      setLoading(false);
      console.log("Form submission ended");
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
        onSubmit={handleSubmit}
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
            <ImageUploader
              setProfileImage={setProfileImage}
              ref={profileImageUploaderRef}
            />
            {formData.profileImage && (
              <div className="relative">
                <Image
                  src={formData.profileImage}
                  alt="Profile preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-40"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalImages">Additional Images</Label>
            <MultiImageUploader ref={uploaderRef} />
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
          type="submit"
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
