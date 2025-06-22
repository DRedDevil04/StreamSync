import mongoose from "mongoose";
import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  Play,
  Copy,
  Lock,
  Globe,
  Film,
  UserPlus,
  Send,
  X,
  Crown,
  Tag,
  Trash2,
  Edit3,
} from "lucide-react";
import api from "../utils/axiosInstance";

const RoomCreationPage = () => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<{
    roomId: string;
    name: string;
    description: string;
    mode: string;
    tags?: string[];
  } | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<{
    _id: mongoose.Types.ObjectId;
    title: string;
    year: number;
    rating: number;
    genre: string;
    duration: string;
    thumbnail: string;
  } | null>(null);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomType, setRoomType] = useState("public");
  const [maxUsers, setMaxUsers] = useState(10);
  const [inviteEmails, setInviteEmails] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [myRooms, setMyRooms] = useState([]);
  const [publicRooms, setPublicRooms] = useState([]);

  // Add these state variables to your existing state declarations
  const [memberSelectionType, setMemberSelectionType] = useState("friends"); // 'friends' or 'groups'
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // State variables for friends and groups with loading states
  const [mockFriends, setMockFriends] = useState<any[]>([]);
  const [mockGroups, setMockGroups] = useState<any[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);

  // Fetch friends and groups on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setFriendsLoading(true);
        const response = await api.get("/connections/friends");
        console.log("Friends API response:", response.data);

        // Handle different possible response structures
        const friendsData = response.data?.friends || response.data || [];
        console.log("Processed friends data:", friendsData);

        if (Array.isArray(friendsData)) {
          setMockFriends(friendsData);
        } else {
          console.warn("Friends data is not an array:", friendsData);
          setMockFriends([]);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        setMockFriends([]);
      } finally {
        setFriendsLoading(false);
      }
    };

    const fetchGroups = async () => {
      try {
        setGroupsLoading(true);
        const response = await api.get("/group/my-groups");
        console.log("Groups API response:", response.data);

        // Handle different possible response structures
        const groupsData =
          response.data?.groups ||
          response.data?.friends ||
          response.data ||
          [];
        console.log("Processed groups data:", groupsData);

        if (Array.isArray(groupsData)) {
          setMockGroups(groupsData);
        } else {
          console.warn("Groups data is not an array:", groupsData);
          setMockGroups([]);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setMockGroups([]);
      } finally {
        setGroupsLoading(false);
      }
    };

    // Fetch both concurrently
    Promise.all([fetchFriends(), fetchGroups()]);
  }, []);

  useEffect(() => {
    console.log("mockFriends:", mockFriends);
  }, [mockFriends]);

  // API call to create room
  const createRoomAPI = async (roomData: any) => {
    try {
      const response = await api.post("/room", roomData);
      return response.data;
    } catch (error) {
      console.error("Error creating room:", error);
      throw new Error("Failed to create room");
    }
  };

  // API call to get user's rooms
  const getUserRoomsAPI = async () => {
    try {
      const response = await api.get("room/my-rooms");
      //console.log("User rooms fetched successfully", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching user rooms:", error);
      throw new Error("Failed to fetch user rooms");
    }
  };

  // API call to delete room
  const deleteRoomAPI = async (roomId: any) => {
    try {
      const response = await api.delete(`/room/${roomId}`);
      return response.data;
    } catch {
      console.error("Error deleting room:", error);
      throw new Error("Failed to delete room");
    }
  };

  // API call to update room settings
  const updateRoomSettingsAPI = async (roomId: any, updateData: any) => {
    try {
      const response = await api.patch(`room/${roomId}/settings`, updateData);
      return response.data;
    } catch {
      console.error("Error updating room settings:", error);
      throw new Error("Failed to update room settings");
    }
  };

  // Load user's rooms on component mount
  useEffect(() => {
    loadUserRooms();
  }, []);

  const loadUserRooms = async () => {
    try {
      setLoading(true);
      const rooms = await getUserRoomsAPI();
      setMyRooms(rooms.rooms);
    } catch (err) {
      setError((err as any).message);
    } finally {
      setLoading(false);
    }
  };

  // Add tag functionality
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: any) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const createRoom = async () => {
    // Updated validation - check for members instead of movie
    if (
      !roomName ||
      (memberSelectionType === "friends" && selectedFriends.length === 0) ||
      (memberSelectionType === "groups" &&
        (!selectedGroup ||
          mockGroups.find((group) => group.id === selectedGroup)?.members
            .length === 0))
    ) {
      setError("Please fill in all required fields and select members");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const roomData = {
        name: roomName,
        description: roomDescription,
        movie: selectedMovie?._id, // This might be null now, adjust based on your backend
        mode: roomType,
        tags: tags,
        maxCapacity: maxUsers,
        // Add member data
        participants:
          memberSelectionType === "friends"
            ? selectedFriends
            : mockGroups.find((group) => group.id === selectedGroup)?.members ||
              [],
      };

      const newRoom = await createRoomAPI(roomData);

      setSuccess("Room created successfully!");
      setShowCreateRoom(false);

      // Reset form
      resetForm();

      // Reload rooms
      loadUserRooms();
    } catch (err) {
      setError((err as any).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRoomName("");
    setRoomDescription("");
    setSelectedMovie(null);
    setRoomType("public");
    setMaxUsers(10);
    setTags([]);
    setCurrentTag("");
    // Add these new reset lines
    setMemberSelectionType("friends");
    setSelectedFriends([]);
    setSelectedGroup(null);
  };

  const deleteRoom = async (roomId: any) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteRoomAPI(roomId);
      setSuccess("Room deleted successfully!");
      loadUserRooms();
    } catch (err) {
      setError((err as any).message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (room: any) => {
    setEditingRoom(room);
    setRoomName(room.name);
    setRoomDescription(room.description);
    setRoomType(room.mode);
    setTags(room.tags || []);
    setShowEditModal(true);
  };

  const updateRoom = async () => {
    if (!roomName || !editingRoom) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const updateData = {
        name: roomName,
        description: roomDescription,
        mode: roomType,
        tags: tags,
      };

      await updateRoomSettingsAPI(editingRoom.roomId, updateData);

      setSuccess("Room updated successfully!");
      setShowEditModal(false);
      resetForm();
      setEditingRoom(null);
      loadUserRooms();
    } catch (err) {
      setError((err as any).message);
    } finally {
      setLoading(false);
    }
  };

  const sendInvites = () => {
    if (inviteEmails.trim()) {
      const emails = inviteEmails.split(",").map((email) => email.trim());
      console.log("Sending invites to:", emails);
      // Implement invite API call here
      setShowInviteModal(false);
      setInviteEmails("");
      setSuccess("Invites sent successfully!");
    }
  };

  const joinRoom = (roomId: any) => {
    console.log("Joining room:", roomId);
    // Navigate to the streaming room
    // window.location.href = `/room/${roomId}`;
  };

  const copyRoomLink = (roomId: any) => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    setSuccess("Room link copied to clipboard!");
  };

  // Helper function to get room status
  const getRoomStatus = (room: any) => {
    if (room.isActive) {
      return room.participants?.length > 1 ? "watching" : "waiting";
    }
    return "inactive";
  };

  // Helper function to format room data for display
  const formatRoomForDisplay = (room: any, isOwner = false) => {
    return {
      id: room._id,
      roomId: room.roomId,
      name: room.name,
      description: room.description,
      type: room.mode,
      members: room.participants?.length || 0,
      maxMembers: room.maxCapacity || 50,
      currentMovie: room.movie?.title || "No movie selected",
      status: getRoomStatus(room),
      thumbnail: room.movie?.thumbnail || "🎬",
      createdAt: new Date(room.createdAt).toLocaleDateString(),
      isOwner: isOwner,
      tags: room.tags || [],
      owner: room.host?.username || "Unknown",
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Movie Nights</h1>
              <p className="text-slate-400">Create rooms and watch together</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateRoom(true)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Room
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* My Rooms Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Rooms</h2>
            <button
              onClick={() => setShowInviteModal(true)}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Invite Friends
            </button>
          </div>

          {loading ? (
            <div className="bg-slate-900/50 rounded-xl p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">Loading rooms...</p>
            </div>
          ) : myRooms.length === 0 ? (
            <div className="bg-slate-900/50 rounded-xl p-12 text-center">
              <Film className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No rooms yet</h3>
              <p className="text-slate-400 mb-6">
                Create your first room to start watching with friends
              </p>
              <button
                onClick={() => setShowCreateRoom(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Create Your First Room
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRooms.map((room) => {
                console.log(room);
                const displayRoom = formatRoomForDisplay(room, true);
                //console.log("Display Room:", displayRoom);
                return (
                  <div
                    key={displayRoom.id}
                    className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{displayRoom.thumbnail}</div>
                        <div>
                          <h3 className="font-semibold">{displayRoom.name}</h3>
                          <p className="text-slate-400 text-sm">
                            {displayRoom.description}
                          </p>
                        </div>
                      </div>
                      <Crown className="w-5 h-5 text-yellow-500" />
                    </div>

                    {/* Tags */}
                    {displayRoom.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {displayRoom.tags.map((tag: any, index: any) => (
                          <span
                            key={index}
                            className="bg-slate-800 text-slate-300 px-2 py-1 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">
                          Currently watching:
                        </span>
                        <span className="font-medium">
                          {displayRoom.currentMovie}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Members:</span>
                        <span>
                          {displayRoom.members}/{displayRoom.maxMembers}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            displayRoom.status === "watching"
                              ? "bg-green-900/50 text-green-400"
                              : displayRoom.status === "waiting"
                              ? "bg-yellow-900/50 text-yellow-400"
                              : "bg-slate-900/50 text-slate-400"
                          }`}
                        >
                          {displayRoom.status === "watching"
                            ? "Live"
                            : displayRoom.status === "waiting"
                            ? "Waiting"
                            : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => joinRoom(displayRoom.roomId)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        {displayRoom.status === "watching" ? "Join" : "Enter"}
                      </button>
                      <button
                        onClick={() => copyRoomLink(displayRoom.roomId)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(room)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRoom(displayRoom.roomId)}
                        className="p-2 bg-red-800 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Public Rooms Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Public Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicRooms.map((room) => {
              const displayRoom = formatRoomForDisplay(room, false);
              return (
                <div
                  key={displayRoom.id}
                  className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{displayRoom.thumbnail}</div>
                      <div>
                        <h3 className="font-semibold">{displayRoom.name}</h3>
                        <p className="text-slate-400 text-sm">
                          by {displayRoom.owner}
                        </p>
                      </div>
                    </div>
                    <Globe className="w-5 h-5 text-blue-500" />
                  </div>

                  <p className="text-slate-300 text-sm mb-4">
                    {displayRoom.description}
                  </p>

                  {/* Tags */}
                  {displayRoom.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {displayRoom.tags.map((tag: any, index: any) => (
                        <span
                          key={index}
                          className="bg-slate-800 text-slate-300 px-2 py-1 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Currently watching:
                      </span>
                      <span className="font-medium">
                        {displayRoom.currentMovie}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Viewers:</span>
                      <span>
                        {displayRoom.members}/{displayRoom.maxMembers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          displayRoom.status === "watching"
                            ? "bg-green-900/50 text-green-400"
                            : displayRoom.status === "waiting"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : "bg-orange-900/50 text-orange-400"
                        }`}
                      >
                        {displayRoom.status === "watching"
                          ? "Live"
                          : displayRoom.status === "waiting"
                          ? "Waiting"
                          : "Starting Soon"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => joinRoom(displayRoom.roomId)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Join Room
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create New Room</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Room Settings */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name..."
                    className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    placeholder="Describe your room..."
                    rows={3}
                    className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  />
                </div>

                {/* Tags Section */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add tags..."
                      className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      onClick={addTag}
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Room Type
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setRoomType("public")}
                      type="button"
                      className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                        roomType === "public"
                          ? "border-blue-600 bg-blue-600/20"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <Globe className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">Public</div>
                      <div className="text-xs text-slate-400">
                        Anyone can join
                      </div>
                    </button>
                    <button
                      onClick={() => setRoomType("private")}
                      type="button"
                      className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                        roomType === "private"
                          ? "border-blue-600 bg-blue-600/20"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <Lock className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-sm font-medium">Private</div>
                      <div className="text-xs text-slate-400">Invite only</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Max Users: {maxUsers}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>2</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Add Members Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Members *</h3>
                  <div className="flex bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setMemberSelectionType("friends")}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        memberSelectionType === "friends"
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Friends
                    </button>
                    <button
                      onClick={() => setMemberSelectionType("groups")}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        memberSelectionType === "groups"
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Groups
                    </button>
                  </div>
                </div>

                {memberSelectionType === "friends" ? (
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {mockFriends.map((friend) => (
                        <div
                          key={friend._id} // Use _id as the unique key
                          onClick={() => {
                            if (selectedFriends.includes(friend._id)) {
                              // Remove the friend from the selected list
                              setSelectedFriends((prevSelected) =>
                                prevSelected.filter((id) => id !== friend._id)
                              );
                            } else {
                              // Add the friend to the selected list
                              setSelectedFriends((prevSelected) => [
                                ...prevSelected,
                                friend._id,
                              ]);
                            }
                          }}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedFriends.includes(friend._id)
                              ? "border-blue-600 bg-blue-600/20"
                              : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {friend.username.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">
                                {friend.username}
                              </h4>
                              <p className="text-sm text-slate-400">
                                {friend.email}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedFriends.includes(friend._id)
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-slate-600"
                              }`}
                            >
                              {selectedFriends.includes(friend._id) && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedFriends.length > 0 && (
                      <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-300">
                          Selected {selectedFriends.length} friend
                          {selectedFriends.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {mockGroups.map((group) => (
                        <div
                          key={group.id}
                          onClick={() =>
                            setSelectedGroup(
                              group.id === selectedGroup ? null : group.id
                            )
                          }
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedGroup === group.id
                              ? "border-blue-600 bg-blue-600/20"
                              : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {group.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{group.name}</h4>
                              <p className="text-sm text-slate-400">
                                {group.memberCount} members
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {group.description}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedGroup === group.id
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-slate-600"
                              }`}
                            >
                              {selectedGroup === group.id && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedGroup && (
                      <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-300">
                          Selected group:{" "}
                          {mockGroups.find((g) => g.id === selectedGroup)?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Members:{" "}
                          {mockGroups
                            .find((g) => g.id === selectedGroup)
                            ?.members.map(
                              (memberId) =>
                                mockFriends.find((f) => f.id === memberId)?.name
                            )
                            .join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowCreateRoom(false);
                  resetForm();
                  setError("");
                }}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createRoom}
                disabled={
                  !roomName ||
                  loading ||
                  (memberSelectionType === "friends" &&
                    selectedFriends.length === 0) ||
                  (memberSelectionType === "groups" && !selectedGroup)
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                {loading && (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                )}
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Room Settings</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                  setEditingRoom(null);
                  setError("");
                }}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name..."
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  placeholder="Describe your room..."
                  rows={3}
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              {/* Tags Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tags..."
                    className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    onClick={addTag}
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Room Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setRoomType("public")}
                    type="button"
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      roomType === "public"
                        ? "border-blue-600 bg-blue-600/20"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Globe className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">Public</div>
                    <div className="text-xs text-slate-400">
                      Anyone can join
                    </div>
                  </button>
                  <button
                    onClick={() => setRoomType("private")}
                    type="button"
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      roomType === "private"
                        ? "border-blue-600 bg-blue-600/20"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Lock className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">Private</div>
                    <div className="text-xs text-slate-400">Invite only</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                  setEditingRoom(null);
                  setError("");
                }}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateRoom}
                disabled={!roomName || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                {loading && (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                )}
                Update Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Friends Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Invite Friends</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Addresses
                </label>
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  placeholder="Enter email addresses separated by commas..."
                  rows={4}
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Separate multiple emails with commas
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendInvites}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Invites
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCreationPage;
