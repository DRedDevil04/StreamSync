export interface ConnectionInfo {
  currentRoom: string | null;
  currentTime: number | null;
  isPlaying: boolean;
}

const connectionStore = new Map<string, ConnectionInfo>();

export default connectionStore;
