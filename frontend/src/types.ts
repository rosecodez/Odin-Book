import React from "react";

export type FeedProps = {
  isAuthenticated: boolean,
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
  setIsVisitor?: React.Dispatch<React.SetStateAction<boolean>>;
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
