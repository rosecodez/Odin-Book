export type FeedProps = {
  isVisitor: boolean,
  // updater function returned by useState
  setIsVisitor: React.Dispatch<React.SetStateAction<boolean>>;
};

export type User = {
  id: number;
  username: string;
  profile_image: string;
};

export type DropdownProps = {
  postId: number;
  editPost: (id: number) => void;
  deletePost: (id: number) => void;
};

export type NewPostProps = {
  isVisitor: boolean;
  setIsVisitor?: React.Dispatch<React.SetStateAction<boolean>>;
};