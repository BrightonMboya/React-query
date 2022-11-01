import NextError from 'next/error';
import { useRouter } from 'next/router';
// import { NextPageWithLayout } from '../_app';
import { trpc, AppRouterTypes } from '../../utils/trpc';

type postByIdOutput = AppRouterTypes['post']['byId']['output'];

function PostItem(props: { post: postByIdOutput }) {
  const { post } = props;
  return (
    <>
      <h1>{post.title}</h1>
      <em>Created at {post.createdAt.toLocaleDateString('en-us')}</em>
      <p>{post.text}</p>
      <h2>Raw data:</h2>
      <pre>{JSON.stringify(post, null, 4)}</pre>
    </>
  );
}

const PostViewPage = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.post.byId.useQuery({ id });

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }
  if (postQuery.status !== 'success') {
    return <>Loading ...</>;
  }
  const { data } = postQuery;
  return <PostItem post={data} />;
};

export default PostViewPage;
