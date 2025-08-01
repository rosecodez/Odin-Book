import React from "react";

export type FeedProps = {
  isVisitor: boolean;
  setIsVisitor: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SignupFormInputs = {
  username: string,
  password: string,
  isVisitor: boolean
}

export type DropdownProps = {
  postId: number;
  editPost: (id: number) => void;
  deletePost: (id: number) => void;
};

export type NewPostProps = {
  isVisitor: boolean;
};

export type HeaderProps = {
  isVisitor: boolean;
  setIsVisitor: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ProfileProps = {
  isVisitor: boolean,
  setIsVisitor: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ProfileFormInputs {
  image: FileList;
}

export type PostsProps = {
  userId: number,
  loggedInUserId: number
}

export type HomeProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isVisitor: boolean;
  setIsVisitor: React.Dispatch<React.SetStateAction<boolean>>;
};

export type PostDetailsProps = {
  username: string;
};

export type AppContentProps = {
  isVisitor: boolean;
  setIsVisitor: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
};

export type FeedPageProps = {
  isAuthenticated: boolean,
  isVisitor: boolean,
  setIsVisitor: React.Dispatch<React.SetStateAction<boolean>>;
}

export type HomePageProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isVisitor: boolean;
  setIsVisitor: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ProfilePageProps = {
  isVisitor: boolean;
  setIsVisitor: React.Dispatch<React.SetStateAction<boolean>>;
};

