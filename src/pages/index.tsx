import { trpc } from '../utils/trpc';
// import { NextPageWithLayout } from './_app';
import { inferProcedureInput } from '@trpc/server';
import Link from 'next/link';
import { Fragment } from 'react';
import type { AppRouter } from '../server/router/_app';

const IndexPage = () => {
  const utils = trpc.useContext();
  const postQuery = trpc.post.list.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      //refetches posts after a post is added
      await utils.post.list.invalidate();
    },
  });

  return (
    <main className="bg-slate-600 text-gray-300 h-[100vh]">
      <h3>Simple Messaging App which uses Prisma</h3>
      <h2>
        Latest Posts
        {postQuery.status === 'loading' && 'loading ...'}
      </h2>

      <button
        onClick={() => postQuery.fetchPreviousPage()}
        disabled={!postQuery.hasNextPage || postQuery.isFetchingPreviousPage}
        className="px-3 py-2 bg-pink-500 rounded-md shadow-md cursor-pointer mt-5"
      >
        {postQuery.isFetchingPreviousPage
          ? 'Loading More baby ...'
          : postQuery.hasPreviousPage
          ? 'load More'
          : 'Nothing more to load'}
      </button>

      {postQuery.data?.pages.map((page, index) => (
        <Fragment key={page.items[0]?.id || index}>
          {page.items.map((item) => (
            <article key={item.id}>
              <h3>{item.title}</h3>
              <Link href={`/post/${item.id}`}>
                <a>View More</a>
              </Link>
            </article>
          ))}
        </Fragment>
      ))}

      <hr />

      <h3>Add a post</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const $form = e.currentTarget;
          const values = Object.fromEntries(new FormData($form));
          type Input = inferProcedureInput<AppRouter['post']['add']>;

          const input: Input = {
            title: values.title as string,
            text: values.text as string,
          };
          try {
            await addPost.mutateAsync(input);
            $form.reset();
          } catch (cause) {
            console.error({ cause }, 'Failed to add Post');
          }
        }}
      >
        <label htmlFor="title">Title:</label>
        <br />
        <input
          id="title"
          name="title"
          type="text"
          disabled={addPost.isLoading}
        />

        <br />
        <label htmlFor="text">Text:</label>
        <br />
        <textarea id="text" name="text" disabled={addPost.isLoading} />
        <br />
        <input type="submit" disabled={addPost.isLoading} />
        {addPost.error && (
          <p style={{ color: 'red' }}>{addPost.error.message}</p>
        )}
      </form>
    </main>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createProxySSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
