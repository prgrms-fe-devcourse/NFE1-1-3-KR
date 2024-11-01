import { useState, useRef, useEffect } from 'react';

import { EditPostModal } from 'components';
import { useCreateComment, useDeletePost, useLikePost, usePost, useUnlikePost } from 'hooks';
import { useAuthStore, useModalStore, usePostStore } from 'stores';

export const DetailPost = ({
  postId,
  onClose,
}: {
  postId: string;
  onClose: (id: string | null) => void;
}) => {
  const [isSetting, setIsSetting] = useState(false);
  const { userInfo } = useAuthStore();
  const [comment, setComment] = useState('');
  const { setPostId, setPostContent } = usePostStore();

  const { data: post } = usePost(postId);

  const { mutate: createNewComment } = useCreateComment(postId);
  const { mutate: deletePostById } = useDeletePost(postId, onClose);
  const { mutate: likePost } = useLikePost(postId);
  const { mutate: unlikePost } = useUnlikePost(postId);

  const openModal = useModalStore(state => state.openModal);

  const handleEdit = () => {
    setPostId(postId);
    setPostContent(post?.content as string);
    openModal('EDIT', { component: EditPostModal });
  };

  const handleLike = () => {
    if (post?.isLiked) {
      unlikePost();
    } else {
      likePost();
    }
  };

  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [post?.comment?.length]);

  return (
    <div className='relative flex items-end justify-center w-full h-full p-[4.5rem]'>
      <button
        className='absolute top-[2rem] left-[1rem] flex items-center justify-center w-6 h-6'
        onClick={() => {
          onClose(null);
        }}
      >
        <img alt='close-button' className='object-contain w-full h-full' src='/chevron-left.svg' />
      </button>
      {userInfo?.user_id && (
        <button
          className='absolute top-[2rem] right-[1rem] flex items-center justify-center w-6 h-6 rounded-full bg-primary p-[0.15rem]'
          onClick={() => {
            setIsSetting(!isSetting);
          }}
        >
          <img
            alt='setting-button'
            className='w-[90%] h-[90%] object-contain'
            src='/Icon/setting.svg'
          />
        </button>
      )}
      {isSetting && (
        <div
          className='absolute top-[4rem] right-[1rem] flex flex-col items-end p-4 bg-white shadow-md rounded-md gap-2 text-sm text-[#333333] cursor-pointer'
          onClick={() => {
            setIsSetting(!isSetting);
          }}
        >
          <span onClick={handleEdit}>edit</span>
          <span
            onClick={() => {
              deletePostById();
            }}
          >
            delete
          </span>
        </div>
      )}
      <div className='flex flex-col w-full h-full p-[2.5rem] items-center justify-between border-2 border-[#afa18b] rounded-[40px] gap-4'>
        <div className='flex w-[80%] max-h-[50%] h-[15rem] gap-8'>
          {post?.books && (
            <img
              alt='bookcover'
              className='h-full rounded object-cover aspect-[200/295]'
              src={post?.books?.cover || '/default-bookcover.png'}
            />
          )}
          <div
            className='flex flex-col justify-between h-full py-4'
            id='info'
            style={{
              width: post?.cover ? '50%' : '100%',
            }}
          >
            <div className='flex items-center w-full gap-4' id='user'>
              <img
                alt='user-profile'
                className='relative w-10 h-10 rounded-full'
                src={post?.userinfo?.profile_url || '/default-userprofile.png'}
              />
              <div className='text-[#1c1c1c] text-base font-normal leading-snug'>
                {post?.userinfo?.username}
              </div>
            </div>
            <div className='flex flex-col w-full gap-2' id='book'>
              {post?.books && (
                <span className='text-[#1c1c1c] text-xs font-normal leading-none'>
                  &lt;{post?.books.title}&gt; -{' '}
                  {post?.books.author.replace(/\(Authors?\)/g, '').trim()}
                </span>
              )}
              <span className='text-[#1c1c1c] text-base font-medium leading-snug max-h-[5rem] overflow-y-auto'>
                {post?.content}
              </span>
            </div>
            <div className='py-1.5 flex justify-start items-center gap-2 w-full' id='icons'>
              <button onClick={handleLike}>
                <img alt='likes' src={post?.isLiked ? '/full-heart.svg' : '/empty-heart.svg'} />
              </button>
              <span className='text-[#333333] text-xs font-normal leading-none'>
                {post?.likes_count}
              </span>
              <img alt='captions' src='/caption.svg' />
              <span className='text-[#333333] text-xs font-normal leading-none'>
                {post?.comment.length}
              </span>
            </div>
          </div>
        </div>
        <div
          className='h-[40%] w-[80%] overflow-y-auto gap-2 items-end flex flex-col'
          id='comments'
          ref={commentsRef}
        >
          {post?.comment.map(
            (com: {
              comment_id: string;
              content: string;
              user_id: string;
              userinfo: { username: string; profile_url: string };
            }) => (
              <div
                className='px-2 py-2 w-full bg-[#fcfcfc] rounded justify-start items-start gap-2.5 inline-flex'
                key={com.comment_id}
              >
                <img
                  alt='user-profile'
                  className='relative w-8 h-8 rounded-2xl'
                  src={com.userinfo?.profile_url || '/default-userprofile.png'}
                />
                <div className='inline-flex flex-col items-center justify-center gap-1 grow shrink basis-0'>
                  <div className="self-stretch text-[#1c1c1c] text-xs font-normal font-['Inknut Antiqua'] leading-none">
                    {com.userinfo?.username}
                  </div>
                  <div className="self-stretch text-[#505050] text-xs font-normal font-['Inknut Antiqua'] leading-none">
                    {com.content}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
        <div className='w-[80%] px-2 py-1 rounded-[60px] border border-[#243868] justify-start items-center gap-2.5 inline-flex'>
          <div className='flex items-center justify-start w-full gap-4'>
            <img
              alt="user's profile"
              className='w-10 h-10 relative rounded-[100px] border border-[#ecf0f5]'
              src={userInfo?.profile_url || '/default-userprofile.png'}
            />
            <input
              className='px-0.5 py-2 justify-start items-center gap-2.5 flex w-full'
              onChange={e => {
                setComment(e.target.value);
              }}
              placeholder="What's on your mind?"
              value={comment}
            />
          </div>
          <div
            className='px-5 py-2 bg-[#243868] rounded-[100px] justify-center items-center gap-2.5 flex text-white text-sm'
            onClick={() => {
              createNewComment({ postId, comment });
              setComment('');
            }}
          >
            Post
          </div>
        </div>
      </div>
    </div>
  );
};
