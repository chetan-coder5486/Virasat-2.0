import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, X } from "lucide-react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const AdminApprovals = ({ familyId }) => {
  const { api } = useAuth();
  const params = useParams();
  const resolvedFamilyId = useMemo(
    () => familyId || params.familyId,
    [familyId, params.familyId],
  );

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      if (!resolvedFamilyId) {
        setError("Missing family id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/invite/requests", {
          params: { familyId: resolvedFamilyId, status: "pending" },
        });
        setRequests(response.data?.requests || response.data || []);
        setError("");
      } catch (err) {
        console.error("Failed to load requests:", err);
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [api, resolvedFamilyId]);

  const handleDecision = async (requestId, decision) => {
    try {
      await api.post(`/invite/requests/${requestId}/review`, { decision });
      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId),
      );
    } catch (err) {
      console.error("Failed to update request:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f6f2ee]">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Pending Join Requests
            </h1>
            <p className="text-gray-600">
              Review new members requesting access to your family.
            </p>
          </div>

          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-white/80 p-6 text-sm text-gray-600">
              Loading requests...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-600">
              {error}
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white/80 p-6 text-sm text-gray-600">
              No pending requests.
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request._id} className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle>{request.requesterId?.name}</CardTitle>
                    <CardDescription>
                      {request.requesterId?.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-600">
                      Requested on{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        className="bg-[#A65E2E] text-white hover:bg-[#8e4f26]"
                        onClick={() => handleDecision(request._id, "approved")}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDecision(request._id, "denied")}
                      >
                        <X className="h-4 w-4" />
                        Deny
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApprovals;
