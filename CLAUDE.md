## React & TanStack Query Conventions

- **Direct Destructuring for Custom Hooks**: Never assign query or mutation hook results to a single container object (e.g., avoid `const createPost = useCreatePost()`).
    - Always destructure properties directly at the call site:
      ```typescript
      // ✅ GOOD
      const { mutate: createPost, isPending: isSubmitting } = useCreatePost();
      const { data: posts, isLoading } = useGetPosts();
  
      // ❌ BAD
      const createPost = useCreatePost();
      createPost.mutate(...);
      ```
- **Name Aliases for Clarity**: When using generic outputs like `mutate` or `data`, alias them immediately to descriptive names (e.g., `mutate: addComment`, `data: comments`) to keep component scope clean and explicit.