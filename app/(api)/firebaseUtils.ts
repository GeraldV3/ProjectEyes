import { database, ref, set } from "@/app/(api)/firebaseConfig";

/**
 * Uploads Base64-encoded data to Firebase Realtime Database.
 * @param {string} base64Data - The Base64-encoded string of the file.
 * @param {string} fileName - The name under which to save the file in the database.
 * @returns {Promise<string>} - A promise resolving with the saved file's database path.
 */
export const uploadToRealtimeDatabase = async (
  base64Data: string,
  fileName: string,
): Promise<string> => {
  try {
    const fileRef = ref(database, `uploads/${fileName}`);
    await set(fileRef, { base64: base64Data });
    console.log("Uploaded file to Realtime Database:", fileName);
    return `uploads/${fileName}`; // Return the database path
  } catch (error) {
    console.error("Error uploading file to Realtime Database:", error);
    throw new Error("Failed to upload file.");
  }
};
