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
import AdminApprovals from "@/pages/AdminApprovals";


const Family = () => {
  const [family, setFamily] = useState(null);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showJoinRequests, setShowJoinRequests] = useState(false);
  const [loading, setLoading] = useState(true);
  const { api,user } = useAuth();
  useEffect(() => {
    
    //fetch family details and members
    const fetchFamilyDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get("/family/");
        setFamily(response.data.family);
        console.log(response.data.family);
      } catch (error) {
        console.error("Error fetching family details:", error);
      }finally{
        setLoading(false);
      }
    };

    fetchFamilyDetails();
  }, []);

 

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
      {
        loading ? (
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <p className="text-gray-600">Loading family details...</p>
          </div>
        ) : null
      }
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
                      {family.name}
                    </h1>
                    <p className="mt-1 text-gray-600">
                      {family.members.length || 0} members •{" "}
                      {family.createdAt ? new Date(family.createdAt).getFullYear() : "Unknown"}
                    </p>
                  </div>
                </div>
                { user.role === "admin" &&
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowJoinRequests(true)}
                    >
                    Join Requests
                  </Button>
                </div>
                  }
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {family.members.map((member) => {
                  const roleStyles =
                    member.role === "admin"
                      ? "bg-[#A65E2E] text-white"
                      : member.role === "contributor"
                        ? "bg-[#E9E0D7] text-[#6b3f1f]"
                        : "bg-white text-gray-700 border border-gray-200";
                  const RoleIcon =
                    member.role === "admin"
                      ? Crown
                      : member.role === "contributor"
                        ? UserCheck
                        : ShieldCheck;

                  return (
                    <Card
                      key={member.name}
                      className="border-gray-200 bg-[#fbf8f4] text-center"
                    >
                      <CardContent className="flex flex-col items-center gap-3 py-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#efe7dd] text-2xl">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            member.name.charAt(0)
                          )}
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
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          showJoinRequests ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setShowJoinRequests(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform border-l border-[#eadfd2] bg-white shadow-xl transition-transform duration-300 sm:w-[420px] ${
          showJoinRequests ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-[#eadfd2] px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8e4f26]">
                  Admin Review
                </p>
                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                  Pending Join Requests
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Approve or deny new members requesting access.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJoinRequests(false)}
              >
                Close
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <AdminApprovals familyId={family?._id} variant="panel" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Family;
