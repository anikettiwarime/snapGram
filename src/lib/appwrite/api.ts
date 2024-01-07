import { ID, Models, Query } from "appwrite";
import { appwriteConfig, account, avatars, database, storage } from "./config";
import { INewPost, INewUser, IUpdatePost } from "@/types";

/*
  ########## Auth functions start ##########
*/

const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) {
      throw new Error("Failed to create account");
    }

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDb({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create account");
  }
};

const saveUserToDb = async (user: {
  accountId: string;
  name: string;
  email: string;
  imageUrl: URL;
  username?: string;
}) => {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    if (!newUser) {
      throw new Error("Failed to save user to database");
    }

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to save user to database");
  }
};

const signInAccount = async (user: { email: string; password: string }) => {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to sign in");
  }
};

const signOutAccount = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to sign out");
  }
};

/*
  ########## Auth functions end ##########
*/

/*
  ########## Helper functions Start ##########
*/

// File helper functions
const uploadFile = async (file: File): Promise<Models.File | null> => {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload file");
  }
};

const getFilePreview = async (fileId: string): Promise<URL | null> => {
  try {
    const fileUrl = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get file preview");
  }
};

const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete file");
  }
};

/*
  ########## Helper functions end ##########
*/

/*
 ########## Post functions start ##########
*/

// Create post
const createPost = async (
  post: INewPost
): Promise<Models.Document | unknown | null> => {
  try {
    // Upload file to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) {
      throw new Error("Failed to upload file");
    }

    // Save post to database
    const fileUrl = await getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Failed to get file preview");
    }

    // Convert tags into an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create post");
  }
};

const getPostById = async (postId: string): Promise<Models.Document> => {
  try {
    const post = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) {
      throw Error;
    }

    return post;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch post with given id");
  }
};

// Get recent posts
const getRecentPosts = async (): Promise<
  Models.DocumentList<Models.Document>
> => {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );

    if (!posts) {
      throw Error;
    }

    return posts;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch recent posts");
  }
};

// Like post
const likePost = async (
  postId: string,
  likesArray: string[]
): Promise<Models.Document | undefined> => {
  try {
    const likedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!likedPost) {
      throw Error;
    }

    return likedPost;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to like post");
  }
};

// Like post
const savePost = async (
  postId: string,
  userId: string
): Promise<Models.Document | unknown | null> => {
  try {
    const likedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!likedPost) {
      throw Error;
    }

    return likedPost;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to save post");
  }
};

// Delete saved post
const deleteSavedPost = async (savedRecordId: string) => {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      savedRecordId
    );

    if (!statusCode) {
      throw Error;
    }

    return { status: "ok" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete saved post");
  }
};

// Edit post
const updatePost = async (
  post: IUpdatePost
): Promise<Models.Document | unknown | null> => {
  const hasFileToUpdate = post.file.length > 0;

  try {
    // Upload file to storage

    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      console.log("has file to update");

      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = await getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatePost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatePost) {
      await deleteFile(post.imageId);
      throw Error("Failed to update post");
    }

    return updatePost;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update post");
  }
};

// Delete post
const deletePost = async (postId: string, imageId: string) => {
  try {
    if (!postId || !imageId) {
      throw Error;
    }
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) {
      throw Error;
    }

    await deleteFile(imageId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
    return error;
  }
};

// GetInfinitePosts
const getInfinitePosts = async ({
  pageParam,
}: {
  pageParam: string | null;
}): Promise<Models.DocumentList<Models.Document>> => {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) {
      throw new Error("Failed to retrieve posts"); // Specify a more specific error type/message
    }

    return posts;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch posts"); // Specify a more specific error type/message
  }
};

// SearchPosts
const searchPosts = async (
  searchTerm: string
): Promise<Models.DocumentList<Models.Document> | undefined> => {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) {
      throw Error;
    }

    return posts;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch posts");
  }
};

/*
 ########## Post functions end ##########
*/

/*
 ########## User functions start ##########
*/

const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) {
      throw new Error("Failed to fetch current user");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch current user");
  }
};

const getUsers = async (limit?: number) => {
  const queries = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const topCreators = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!topCreators) {
      throw new Error("Failed to fetch top creators");
    }

    return topCreators;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch top creators");
  }
};

/*
 ########## User functions end ##########
*/

export {
  // Authentication functions
  createUserAccount,
  saveUserToDb,
  signInAccount,
  signOutAccount,

  // User functions
  getCurrentUser,
  getUsers,

  // Post functions
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getRecentPosts,
  getInfinitePosts,
  searchPosts,
  likePost,
  savePost,
  deleteSavedPost,

  // File helper functions
  uploadFile,
  getFilePreview,
  deleteFile,
};
