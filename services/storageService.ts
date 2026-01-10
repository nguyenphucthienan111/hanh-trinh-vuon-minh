import { LeaderboardEntry, UserProfile } from "../types";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
  doc,
} from "firebase/firestore";

const COLLECTION_NAME = "leaderboard";

// Fallback mock data if Firebase fails or isn't configured
const MOCK_LEADERS: LeaderboardEntry[] = [
  {
    id: "m1",
    name: "Nguyễn Văn A",
    avatarId: "1",
    totalXp: 450,
    title: "Lãnh Tụ Tương Lai",
    timestamp: Date.now(),
  },
  {
    id: "m2",
    name: "Trần Thị B",
    avatarId: "2",
    totalXp: 380,
    title: "Chiến Sĩ Cách Mạng",
    timestamp: Date.now() - 100000,
  },
];

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("totalXp", "desc"),
      limit(50)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return MOCK_LEADERS;
    }

    const leaders: LeaderboardEntry[] = [];
    querySnapshot.forEach((doc) => {
      leaders.push({ id: doc.id, ...doc.data() } as LeaderboardEntry);
    });
    return leaders;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return MOCK_LEADERS;
  }
};

export const saveScore = async (user: UserProfile) => {
  try {
    const level = Math.floor(user.totalXp / 50) + 1;
    let title = "Tân Binh";
    if (level === 2) title = "Người Rèn Luyện";
    if (level === 3) title = "Chiến Sĩ Cách Mạng";
    if (level >= 4) title = "Lãnh Tụ Tương Lai";

    const newEntry: Omit<LeaderboardEntry, "id"> = {
      name: user.name,
      avatarId: user.avatarId,
      totalXp: user.totalXp,
      title: title,
      timestamp: Date.now(),
    };

    // We use the user's name as a document ID to update their score if they play again,
    // effectively keeping only their highest/latest score.
    // In a real production app with auth, we would use user.uid.
    // sanitize name for doc id
    const safeId = user.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");

    await setDoc(doc(db, COLLECTION_NAME, safeId), newEntry);
  } catch (error) {
    console.error("Error saving score:", error);
  }
};
