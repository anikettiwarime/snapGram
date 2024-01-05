import { Client, Databases, Account, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_ID,
  url: import.meta.env.VITE_APPWRITE_ENDPOINT,

  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,

  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
  saveCollectionId: import.meta.env.VITE_APPWRITE_SAVE_COLLECTION_ID,
};

export const client = new Client();
client.setProject(appwriteConfig.projectId).setEndpoint(appwriteConfig.url);

export const database = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
