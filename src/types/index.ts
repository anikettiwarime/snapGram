import { Models } from "appwrite";

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type PostFormProps = {
  post: Models.Document | null;
  action: "Create" | "Update";
};

export type PostCardProps = {
  post: Models.Document;
};

export type PostStatsProps = {
  post: Models.Document | undefined;
  userId: string;
};

export type GridPostListProps = {
  posts: Models.DocumentList<Models.Document>;
  showStats?: boolean;
  showUser?: boolean;
};

export type SearchResultsProps = {
  searchedPosts: Models.DocumentList<Models.Document> | undefined;
  isSearchFetching: boolean;
};

export type UserCardProps = {
  user: Models.Document;
};
