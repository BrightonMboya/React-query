import React from 'react';
import { usePosts } from '../../hooks/usePosts';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../../hooks/usePosts';

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['posts', 10], () => fetchPosts(10));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const basic = () => {
  const [postCount, setPostCount] = React.useState(10);
  const { data, isLoading, isFetching } = usePosts(postCount);
  if (isLoading) return <div>It is Loading baby</div>;
  if (isLoading) return <div>Chill I am fetching</div>;
  console.log(data);

  return (
    <div>
      <ul>
        {data?.map((post, index: number) => (
          <li key={post.id}>
            <div>
              <span>{index + 1}. </span>
              <a href="#">{post.title}</a>
            </div>
          </li>
        ))}

        {postCount <= 90 && (
          <button
            onClick={() => setPostCount(postCount + 10)}
            disabled={isFetching}
            className="bg-amber-400 px-4 py-2 rounded-md shadow-md"
          >
            {isFetching ? 'I am fetching baby' : 'Click Me baby'}
          </button>
        )}
      </ul>
    </div>
  );
};

export default basic;
