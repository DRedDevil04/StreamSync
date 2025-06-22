import React, { useState, useEffect } from "react";
import { Users, Clock, Check, X, RefreshCw, AlertCircle } from "lucide-react";
import api from "@/utils/axiosInstance";
import { useDispatch } from "react-redux";
import { addFriend } from "../slices/userSlice"; // Adjust the import based on your store structure

interface Request {
  id: string;
  _id: string; // Added _id as well since your API might use this
  userId: string;
  username: string;
  avatar?: string | null;
  sentAt: Date;
  message?: string;
  from?: {
    username: string;
  };
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const ViewRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(
    new Set()
  );
  const dispatch = useDispatch();
  const fetchRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/connections/requests");
      console.log("Fetched requests:", res.data);
      setRequests(res.data.requests);
    } catch (err) {
      setError("Failed to load requests. Please try again.");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (
    requestId: string,
    action: "accept" | "decline"
  ): Promise<void> => {
    try {
      setProcessingRequests((prev) => new Set(prev).add(requestId));

      const response = await api.post(`/connections/requests/handle`, {
        requestId,
        action,
      });

      // Show success message (you can add toast notification here)
      console.log(`Request ${action}ed successfully`);

      if (action === "accept") {
        dispatch(addFriend(response.data.from_id));
      }

      // Remove the request from the state after successful handling
      setRequests((prev) =>
        prev.filter(
          (request) => request.id !== requestId && request._id !== requestId
        )
      );
    } catch (err) {
      setError(`Failed to ${action} request. Please try again.`);
      console.error(`Error ${action}ing request:`, err);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now: Date = new Date();
    const requestDate = new Date(date); // Fixed: use the passed date instead of creating new Date()
    const diffInHours = Math.floor(
      (now.getTime() - requestDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - requestDate.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const refreshRequests = (): void => {
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Pending Requests ({requests.length})
        </h2>
        <button
          onClick={refreshRequests}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-slate-800"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 text-sm underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No pending requests</p>
          <p className="text-slate-500 text-sm mt-1">
            New requests will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request: Request) => {
            // Use _id if available, otherwise fall back to id
            const requestId = request._id || request.id;
            const isProcessing = processingRequests.has(requestId);

            return (
              <div
                key={requestId}
                className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      {request.avatar ? (
                        <img
                          src={request.avatar}
                          alt={request.from?.username || request.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-slate-300" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-medium truncate">
                        {request.from?.username || request.username}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <p className="text-slate-400 text-sm">
                          {formatTimeAgo(request.sentAt)}
                        </p>
                      </div>
                      {request.message && (
                        <p className="text-slate-500 text-sm mt-1 truncate">
                          {request.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleRequest(requestId, "accept")}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {isProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => handleRequest(requestId, "decline")}
                      disabled={isProcessing}
                      className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {isProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewRequests;
