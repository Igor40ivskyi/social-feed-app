import { Post } from '@/types/post';

type MergePostsWithLocalDataParams = {
  serverPosts: Post[];
  createdPosts: Post[];
  updatedPostsMap: Record<number, Post>;
  deletedPostIds: number[];
  skip: number;
  searchQuery: string;
};

export const mergePostsWithLocalData = ({
  serverPosts,
  createdPosts,
  updatedPostsMap,
  deletedPostIds,
  skip,
  searchQuery,
}: MergePostsWithLocalDataParams): Post[] => {
  const posts = serverPosts.map((post) => updatedPostsMap[post.id] ?? post);

  const merged = skip === 0 && !searchQuery.trim() ? [...createdPosts, ...posts] : posts;

  const deletedPostIdsSet = new Set(deletedPostIds);
  return merged.filter((post) => !deletedPostIdsSet.has(post.id));
};
