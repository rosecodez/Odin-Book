export interface User {
  id: number;
  username: string;
  profile_image: string;
  bio: string;
  created_at: string;
  googleId?: string;
  isVisitor: boolean;
}

export interface Post {
  id: number;
  content: string;
  created_at: string;
  userId: number;
  post_image?: string;
  comment: Comment[];
  like: Like[];
  user: User;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  userId: number;
  postId: number;
  user: User;
}

export interface Like {
  id: number;
  created_at: string;
  userId: number;
  postId: number;
  user: User;
}


export interface Message {
  id: number;
  content: string;
  created_at: string;
  conversation_id: string;
  sender_id: number;
  userId?: number;
  conversationId?: number;
  image?: string;
  user?: User;
}

export interface Conversation {
  id: number;
  created_at: string;
  messages: Message[];
  conversation_participants: ConversationParticipant[];
}


export interface ConversationParticipant {
  id: number;
  userId: number;
  conversationId?: number;
  conversation?: Conversation;
  user: User;
}

export interface LoginFormInputs {
  username: string;
  password: string;
  isVisitor: boolean;
}