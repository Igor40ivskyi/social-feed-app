export const apiEndpoints = {
  posts: {
    base: '/posts',
    search: '/posts/search',
    create: '/posts/add',
    detail: (id: number | string) => `/posts/${id}` as const,
    comments: (id: number | string) => `/posts/${id}/comments` as const,
  },
  users: {
    detail: (id: number | string) => `/users/${id}` as const,
  },
} as const;
