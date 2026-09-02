const MINUTE = 1000 * 60;

export const queryTimes = {
  postsFeed: {
    staleTime: MINUTE * 1,
    gcTime: MINUTE * 10,
  },
  postDetail: {
    staleTime: MINUTE * 10,
    gcTime: MINUTE * 30,
  },
  comments: {
    staleTime: 1000 * 30,
    gcTime: MINUTE * 5,
  },
  user: {
    staleTime: MINUTE * 30,
    gcTime: MINUTE * 60,
  },
} as const;
