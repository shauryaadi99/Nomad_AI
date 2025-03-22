import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { app } from "@/service/firebase.Config"; // Adjusted path

const db = getFirestore(app); // Initialize Firestore

// IDs to keep (modify as needed)
const keepIds = ["1742629727148", "1742629844738", "1742629920549", "1742629986684"];

export const deleteAllExcept = async () => {
  try {
    const collectionName = "NomadlyAI"; // Your collection name
    const querySnapshot = await getDocs(collection(db, collectionName));

    if (querySnapshot.empty) {
      console.log(`No documents found in '${collectionName}'.`);
      return;
    }

    const deletePromises = querySnapshot.docs
      .filter((docSnap) => !keepIds.includes(docSnap.id)) // Exclude specified IDs
      .map((docSnap) => deleteDoc(doc(db, collectionName, docSnap.id)));

    await Promise.all(deletePromises);
    console.log(`Deleted all documents except for IDs: ${keepIds.join(", ")}`);
  } catch (error) {
    console.error(`Error deleting documents: ${error.message}`);
  }
};

export default deleteAllExcept;
