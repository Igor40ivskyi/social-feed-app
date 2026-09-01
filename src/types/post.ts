export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  reactions: {
    likes: number;
    dislikes: number;
  };
  tags: string[];
};
