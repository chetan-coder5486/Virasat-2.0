import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import {
  Crown,
  Mail,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CreateFamilyForm from "@/components/CreateFamilyForm";
import InviteMemberModal from "@/components/InviteMemberModal";
import { Link } from "react-router";

const Family = () => {
  const [family, setFamily] = useState(null);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const { api } = useAuth();
  useEffect(() => {
    //fetch family details and members
    const fetchFamilyDetails = async () => {
      try {
        const response = await api.get("/family/");
        setFamily(response.data.family);
        console.table(response.data.family);
      } catch (error) {
        console.error("Error fetching family details:", error);
      }
    };

    fetchFamilyDetails();
  }, []);

  const mockFamily = {
    name: "The Johnson Family",
    stats: {
      members: 8,
      stories: 174,
      since: "1920",
    },
    members: [
      { name: "Grandma Ruth", role: "Admin", stories: 42, emoji: "👵" },
      { name: "Dad (Michael)", role: "Admin", stories: 28, emoji: "👨" },
      { name: "Mom (Sarah)", role: "Contributor", stories: 35, emoji: "👩" },
      { name: "Uncle Frank", role: "Contributor", stories: 15, emoji: "👴" },
      { name: "Jenny", role: "Contributor", stories: 22, emoji: "👩" },
      { name: "David", role: "Viewer", stories: 8, emoji: "👦" },
      { name: "Lisa", role: "Contributor", stories: 19, emoji: "👩" },
      { name: "Anna", role: "Viewer", stories: 5, emoji: "👧" },
    ],
  };

  const handleCreateFamily = () => {
    setShowCreateFamily(true);
  };

  const handleCloseCreateFamily = () => {
    setShowCreateFamily(false);
  };

  const handleOpenInvite = () => {
    setShowInviteMember(true);
  };

  const handleCloseInvite = () => {
    setShowInviteMember(false);
  };
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-[#f6f2ee]">
        <div className="container mx-auto px-4 py-10">
          {family ? (
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#A65E2E]/10 text-3xl">
                    🌳
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {mockFamily.name}
                    </h1>
                    <p className="mt-1 text-gray-600">
                      {mockFamily.stats.members} members •{" "}
                      {mockFamily.stats.stories} stories shared • Since{" "}
                      {mockFamily.stats.since}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-[#A65E2E] text-white hover:bg-[#8e4f26]"
                    type="button"
                    onClick={handleOpenInvite}
                  >
                    <Mail className="h-4 w-4" />
                    Invite Member
                  </Button>
                  <Button type="button" variant="outline">
                    <ShieldCheck className="h-4 w-4" />
                    Manage Roles
                  </Button>
                </div>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {mockFamily.members.map((member) => {
                  const roleStyles =
                    member.role === "Admin"
                      ? "bg-[#A65E2E] text-white"
                      : member.role === "Contributor"
                        ? "bg-[#E9E0D7] text-[#6b3f1f]"
                        : "bg-white text-gray-700 border border-gray-200";
                  const RoleIcon =
                    member.role === "Admin"
                      ? Crown
                      : member.role === "Contributor"
                        ? UserCheck
                        : ShieldCheck;

                  return (
                    <Card
                      key={member.name}
                      className="border-gray-200 bg-[#fbf8f4] text-center"
                    >
                      <CardContent className="flex flex-col items-center gap-3 py-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#efe7dd] text-2xl">
                          {member.emoji}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {member.name}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${roleStyles}`}
                        >
                          <RoleIcon className="h-3.5 w-3.5" />
                          {member.role}
                        </span>
                        <p className="text-sm text-gray-600">
                          {member.stories} stories
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">
                  Create or Join a Family
                </h1>
                <p className="mt-2 text-gray-600">
                  Start your family trunk or join one that already exists.
                </p>
              </div>

              <div className="grid w-full gap-6 md:grid-cols-2">
                <Card className="border-gray-200 bg-white/90 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#A65E2E]/10 text-[#A65E2E]">
                        <Users className="h-5 w-5" />
                      </span>
                      <div>
                        <CardTitle>Create a Family</CardTitle>
                        <CardDescription>
                          Start a new space for shared memories.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Invite relatives, set a family name, and begin adding
                      stories and photos.
                    </p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button
                      className="bg-[#A65E2E] text-white hover:bg-[#8e4f26]"
                      onClick={handleCreateFamily}
                      size="lg"
                      type="button"
                    >
                      Create Family
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-gray-200 bg-white/90 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                        <UserPlus className="h-5 w-5" />
                      </span>
                      <div>
                        <CardTitle>Join a Family</CardTitle>
                        <CardDescription>
                          Use an invite code to join your family.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      If someone invited you, enter the code to access stories
                      and memories.
                    </p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Link to="/join">
                      <Button size="lg" type="button" variant="outline">
                        Join Family
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCreateFamily ? (
        <CreateFamilyForm onClose={handleCloseCreateFamily} />
      ) : null}
      {showInviteMember ? (
        <InviteMemberModal familyId={family?._id} onClose={handleCloseInvite} />
      ) : null}
    </>
  );
};

export default Family;
