import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, KeyRound } from "lucide-react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const JoinFamily = () => {
  const { api } = useAuth();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");
    if (urlToken) setToken(urlToken);
  }, [location.search]);

  const handleJoin = async (event) => {
    event.preventDefault();
    if (token.trim().length !== 16) {
      setError("Please enter a valid 16-character invite code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/invite/join", {
        token: token.trim(),
      });
      setStatus(response.data?.message || "You have joined the family.");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f6f2ee]">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-xl">
          <Card className="border-gray-200 bg-white/95 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#A65E2E]/10 text-[#A65E2E]">
                  <KeyRound className="h-5 w-5" />
                </span>
                <div>
                  <CardTitle>Join a Family Circle</CardTitle>
                  <CardDescription>
                    Enter your invite code to join a family.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {status ? (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    {status}
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleJoin}>
                  <div className="space-y-2">
                    <Label htmlFor="inviteToken">Invite code</Label>
                    <Input
                      id="inviteToken"
                      value={token}
                      onChange={(event) =>
                        setToken(event.target.value.replace(/\s+/g, ""))
                      }
                      maxLength={16}
                      placeholder="k9mX2pQvN8rLwT4j"
                      className="tracking-[0.3em] text-center text-base"
                    />
                    <p className="text-xs text-gray-500">
                      Codes are 16 characters long.
                    </p>
                  </div>

                  {error ? (
                    <p className="text-sm text-red-600">{error}</p>
                  ) : null}

                  <Button
                    type="submit"
                    className="w-full bg-[#A65E2E] text-white hover:bg-[#8e4f26]"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Join Family"}
                  </Button>
                </form>
              )}
            </CardContent>

            <CardFooter className="text-sm text-gray-500">
              Need an invite? Ask a family admin to send you a code.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JoinFamily;
