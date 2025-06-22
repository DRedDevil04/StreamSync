import Room from "../models/Room.js";

// ✅ Create Room
export const createRoom = async (req, res) => {
  try {
    const { name, description, movie, mode, tags , maxCapacity } = req.body;
    const host = req.user.id; // assuming auth middleware
    const roomId = `${host}-${Date.now()}`; // generate unique roomId

    const newRoom = await Room.create({
      roomId,
      name,
      description,
      host,
      movie,
      mode,
      tags,
      participants: [host],
      maxCapacity
    });

    res.status(201).json({ message: "Room created", room: newRoom });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating room", error: err.message });
  }
};

// ❌ Delete Room
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    console.log("Deleting room with ID:", roomId);

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.host.toString() !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await Room.deleteOne({ roomId });

    res.status(200).json({ message: "Room deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting room", error: err.message });
  }
};

// ✏️ Update Room Settings
export const updateRoomSettings = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    const { name, description, mode } = req.body;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.host.toString() !== userId)
      return res.status(403).json({ message: "Not authorized" });

    if (name) room.name = name;
    if (description) room.description = description;
    if (mode) room.mode = mode;

    await room.save();

    res.status(200).json({ message: "Room settings updated", room });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating settings", error: err.message });
  }
};

export const addParticipant = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { participantId } = req.body;
    const userId = req.user.id;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.host.toString() !== userId)
      return res.status(403).json({ message: "Not authorized" });

    if (room.participants.includes(participantId))
      return res.status(400).json({ message: "User already a participant" });

    room.participants.push(participantId);
    await room.save();

    res.status(200).json({ message: "Participant added", room });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding participant", error: err.message });
  }
};

export const removeParticipant = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { participantId } = req.body;
    const userId = req.user.id;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.host.toString() !== userId)
      return res.status(403).json({ message: "Not authorized" });

    room.participants = room.participants.filter(
      (id) => id.toString() !== participantId
    );
    await room.save();

    res.status(200).json({ message: "Participant removed", room });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing participant", error: err.message });
  }
};

export const getUserRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const rooms = await Room.find({
      $or: [{ host: userId }, { participants: userId }],
    })
      .populate("movie")
      .populate("host", "name")
      .populate("participants", "name");

    res.status(200).json({ rooms });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: err.message });
  }
};
