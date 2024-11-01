import type { PostDTO } from 'types';

export const Post = ({ post }: { post: PostDTO }) => {
  return (
    <div className='max-h-[16rem] h-full w-full px-2 py-[1.875rem] border-b border-[#243868] justify-center items-center gap-2 inline-flex cursor-pointer'>
      <img
        alt='book-cover'
        className='h-[193px] rounded object-cover aspect-[200/295]'
        src={post.books?.cover || '/default-bookcover.png'}
      />
      <div className='flex-col items-start flex w-full h-full gap-[1.5rem] px-2'>
        <div className='inline-flex items-center self-stretch justify-start gap-4'>
          <img
            alt='user-profile'
            className='w-10 h-10 relative rounded-[100px]'
            src={post.userinfo?.profile_url || '/default-userprofile.png'}
          />
          <div className='text-[#333333] text-base font-normal leading-snug'>
            {post.userinfo?.username}
          </div>
        </div>
        <div className='inline-flex flex-col items-start justify-center w-full gap-2 px-2'>
          {post.books != null && (
            <span className='text-[#333333] text-xs font-normal leading-none'>
              &lt;{post.books.title}&gt; - {post.books.author?.replace(/\(Authors?\)/g, '').trim()}
            </span>
          )}
          <span className='text-[#333333] text-base font-medium leading-snug'>{post.content}</span>
        </div>
      </div>
    </div>
  );
};
