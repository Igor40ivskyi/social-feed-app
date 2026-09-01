import { Post } from '@/types/post';

type MergePostsWithLocalDataParams = {
  serverPosts: Post[];
  createdPosts: Post[];
  updatedPostsMap: Record<number, Post>;
  skip: number;
  searchQuery: string;
};

export const mergePostsWithLocalData = ({
  serverPosts,
  createdPosts,
  updatedPostsMap,
  skip,
  searchQuery,
}: MergePostsWithLocalDataParams): Post[] => {
  const posts = serverPosts.map((post) => updatedPostsMap[post.id] ?? post);

  if (skip === 0 && !searchQuery.trim()) {
    return [...createdPosts, ...posts];
  }

  return posts;
};
