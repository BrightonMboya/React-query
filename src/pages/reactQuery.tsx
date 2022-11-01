import React from 'react';
import {
  QueryClient,
  dehydrate,
  useQuery,
  useInfiniteQuery,
} from '@tanstack/react-query';

// This is the fn to call useQuery
async function getPosts() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await posts.json();
  return data;
}

export async function getStaticProps() {
  const queryClient = new QueryClient();

  //   await queryClient.prefetchQuery(['posts'], getPosts);
  try {
    const data = await queryClient.fetchInfiniteQuery({
      queryKey: ['posts'],
      queryFn: getPosts,
    });
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const reactQuery = () => {
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts });
  console.log(data);
  return <div>Hey mama</div>;
};

export default reactQuery;
