import { LeaderboardEntry, UserProfile } from "../types";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const COLLECTION_NAME = "leaderboard";

// Cache for leaderboard data
let cachedLeaderboard: LeaderboardEntry[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 300000; // 5 minutes cache for faster loading

export const getLeaderboard = async (forceRefresh: boolean = false): Promise<LeaderboardEntry[]> => {
  // Return cached data if available and not expired
  const now = Date.now();
  if (!forceRefresh && cachedLeaderboard && (now - cacheTimestamp < CACHE_DURATION)) {
    return cachedLeaderboard;
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("totalXp", "desc"),
      limit(50)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      cachedLeaderboard = [];
      cacheTimestamp = now;
      return [];
    }

    const leaders: LeaderboardEntry[] = [];
    querySnapshot.forEach((doc) => {
      leaders.push({ id: doc.id, ...doc.data() } as LeaderboardEntry);
    });
    
    // Update cache
    cachedLeaderboard = leaders;
    cacheTimestamp = now;
    
    return leaders;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
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
    
    // Invalidate cache to force refresh
    cachedLeaderboard = null;
  } catch (error) {
    console.error("Error saving score:", error);
  }
};

// Save quiz score specifically (for quiz game leaderboard)
export const saveQuizScore = async (userName: string, avatarId: string, quizScore: number) => {
  try {
    const safeId = userName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");

    // Check if user already has a score
    const userDocRef = doc(db, COLLECTION_NAME, safeId);
    const existingDoc = await getDoc(userDocRef);
    let existingScore = 0;
    
    if (existingDoc.exists()) {
      existingScore = existingDoc.data().totalXp || 0;
    }

    // Only save if new score is higher
    const finalScore = Math.max(existingScore, quizScore);
    
    const level = Math.floor(finalScore / 2000) + 1;
    let title = "Tân Binh";
    if (finalScore >= 8000) title = "Lãnh Tụ Tương Lai";
    else if (finalScore >= 6000) title = "Chiến Sĩ Cách Mạng";
    else if (finalScore >= 4000) title = "Người Rèn Luyện";

    const newEntry: Omit<LeaderboardEntry, "id"> = {
      name: userName,
      avatarId: avatarId,
      totalXp: finalScore, // Store highest quiz score
      title: title,
      timestamp: Date.now(),
    };

    await setDoc(userDocRef, newEntry);
    
    // Invalidate cache to force refresh
    cachedLeaderboard = null;
  } catch (error) {
    console.error("Error saving quiz score:", error);
  }
};

export const deleteLeaderboardEntry = async (entryId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, entryId));
    
    // Invalidate cache
    cachedLeaderboard = null;
    
    return true;
  } catch (error) {
    console.error("Error deleting leaderboard entry:", error);
    return false;
  }
};
