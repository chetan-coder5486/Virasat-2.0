import React, { useEffect, useMemo, useState } from "react";
import { Camera, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { user, api } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarInput, setAvatarInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [avatarMessage, setAvatarMessage] = useState("");

  const defaultAvatar = useMemo(
    () =>
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='96' height='96' rx='48' fill='%23F0E7DD'/><circle cx='48' cy='38' r='16' fill='%23D8C6B6'/><path d='M24 84c6-16 26-22 24-22s18 6 24 22' fill='%23D8C6B6'/></svg>",
    []
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) {
        setLoading(false);
        setError("Missing user data.");
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/user/profile/${user._id}`);
        const userData = response.data?.user;
        setProfile(userData || null);
        setName(userData?.name || "");
        setBio(userData?.bio || "");
        setAvatarInput(userData?.avatar || "");
        setError("");
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [api, user?._id]);

  const initials = useMemo(() => {
    if (!name) return "FT";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }, [name]);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileMessage("");

    try {
      setProfileSaving(true);
      const response = await api.put("/user/profile/update", { name, bio });
      setProfile(response.data?.user || profile);
      setProfileMessage("Profile updated.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setProfileMessage("Unable to update profile right now.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarSave = async (event) => {
    event.preventDefault();
    setAvatarMessage("");

    try {
      setAvatarSaving(true);
      const response = await api.put("/user/profile/picture", {
        avatar: avatarInput,
      });
      setProfile(response.data?.user || profile);
      setAvatarMessage("Profile photo updated.");
    } catch (err) {
      console.error("Failed to update profile photo:", err);
      setAvatarMessage("Unable to update photo right now.");
    } finally {
      setAvatarSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8f3ee] to-[#f1e8df]">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-24 h-80 w-80 rounded-full bg-[#f0e4d8] blur-3xl" />
        <div className="pointer-events-none absolute -right-48 top-12 h-96 w-96 rounded-full bg-[#f6efe8] blur-3xl" />
        <div className="container mx-auto px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8e4f26]">
                Profile
              </p>
              <h1 className="mt-3 text-3xl font-bold text-gray-900">
                Shape your family story
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Keep your profile fresh and personal.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[#eadfd2] bg-white/80 p-6 text-sm text-gray-600">
                Loading profile...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                {error}
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <div className="space-y-6">
                  <Card className="border-[#eadfd2] bg-white/90">
                    <CardHeader>
                      <CardTitle>Profile Photo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center gap-4">
                        <Avatar size="lg" className="h-20 w-20">
                          <AvatarImage
                            src={profile?.avatar || defaultAvatar}
                            alt="Profile"
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-gray-900">
                          {name || "Your name"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {profile?.family?.name
                            ? `Family: ${profile.family.name}`
                            : "No family linked yet"}
                        </p>
                      </div>

                      <form
                        onSubmit={handleAvatarSave}
                        className="mt-6 space-y-3"
                      >
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                          Image URL
                        </label>
                        <Input
                          value={avatarInput}
                          onChange={(event) =>
                            setAvatarInput(event.target.value)
                          }
                          placeholder="https://..."
                        />
                        <Button
                          type="submit"
                          className="w-full bg-[#A65E2E] text-white hover:bg-[#8e4f26]"
                          disabled={avatarSaving}
                        >
                          <Camera className="h-4 w-4" />
                          {avatarSaving ? "Saving..." : "Update photo"}
                        </Button>
                        {avatarMessage ? (
                          <p className="text-xs text-gray-600">
                            {avatarMessage}
                          </p>
                        ) : null}
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="border-[#eadfd2] bg-white/90">
                    <CardHeader>
                      <CardTitle>Profile Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Your profile helps family members recognize you quickly.
                      </p>
                      <div className="mt-4 rounded-xl border border-[#eadfd2] bg-[#fbf6f0] p-4 text-xs text-gray-600">
                        Tip: Keep your bio short and warm. Try a memory, a
                        nickname, or a role in the family.
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-[#eadfd2] bg-white/95">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSave} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                          Display name
                        </label>
                        <Input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                          Bio
                        </label>
                        <Textarea
                          value={bio}
                          onChange={(event) => setBio(event.target.value)}
                          placeholder="Share a short memory or intro"
                          rows={5}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="submit"
                          className="bg-[#A65E2E] text-white hover:bg-[#8e4f26]"
                          disabled={profileSaving}
                        >
                          <Save className="h-4 w-4" />
                          {profileSaving ? "Saving..." : "Save changes"}
                        </Button>
                        {profileMessage ? (
                          <span className="text-xs text-gray-600">
                            {profileMessage}
                          </span>
                        ) : null}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
