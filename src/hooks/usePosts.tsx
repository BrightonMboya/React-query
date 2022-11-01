import { useQuery } from '@tanstack/react-query';

const fetchPosts = async (limit = 10) => {
  const parsed = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await parsed.json();
  const result = data.filter((x) => x.id <= limit);
  return result;
};

const usePosts = (limit: number) => {
  return useQuery({
    queryKey: ['posts', limit],
    queryFn: () => fetchPosts(limit),
    keepPreviousData: true,
  });
};

export { usePosts, fetchPosts };
