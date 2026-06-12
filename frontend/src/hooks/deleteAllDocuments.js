import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { app } from "@service/firebase.config";

const db = getFirestore(app); // Initialize Firestore

export const deleteAllDocuments = async () => {
  try {
    const collectionName = "NomadlyAI"; // Your collection name as a string
    const querySnapshot = await getDocs(collection(db, collectionName));

    if (querySnapshot.empty) {
      console.log(`No documents found in '${collectionName}'.`);
      return;
    }

    const deletePromises = querySnapshot.docs.map((docSnap) => 
      deleteDoc(doc(db, collectionName, docSnap.id))
    );

    await Promise.all(deletePromises);
    console.log(`All documents from '${collectionName}' deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting documents: ${error.message}`);
  }
};

export default deleteAllDocuments;
