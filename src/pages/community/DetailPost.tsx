import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { createComment, deletePost, getPostById } from 'api';
import { EditPostModal } from 'components';
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

  const queryClient = useQueryClient();

  const { data: post } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  });

  const { mutate: createNewComment } = useMutation({
    mutationFn: () =>
      createComment({
        post_id: postId,
        content: comment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] }).catch(error => {
        console.error('Error invalidating queries:', error);
      });
    },
    onError: error => {
      console.error('Error creating post:', error);
    },
  });

  const { mutate: deletePostById } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postList'] }).catch(error => {
        console.error('Error invalidating queries:', error);
      });
      onClose(null);
    },
    onError: error => {
      console.error('Error deleting post:', error);
    },
  });

  const openModal = useModalStore(state => state.openModal);

  const handleEdit = () => {
    setPostId(postId);
    setPostContent(post?.content as string);
    openModal('EDIT', { component: EditPostModal });
  };

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
              console.log('delete');
              deletePostById();
            }}
          >
            delete
          </span>
        </div>
      )}
      <div className='flex flex-col w-full h-full p-[2.5rem] items-center justify-end border-2 border-[#afa18b] rounded-[40px] gap-4'>
        <div className='flex w-[80%] max-h-[50%] h-[15rem] gap-8'>
          <img
            alt='bookcover'
            className='h-full rounded object-cover aspect-[200/295]'
            src='/default-bookcover.png'
          />
          <div className='flex flex-col justify-between h-full py-4' id='info'>
            <div className='flex items-center w-full gap-4' id='user'>
              <img
                alt='user-profile'
                className='relative w-10 h-10 rounded-full'
                src={post?.userinfo?.profile_url || '/default-userprofile.png'}
              />
              <div className='text-[#1c1c1c] text-base font-normal leading-snug'>
                {post?.userinfo.username}
              </div>
            </div>
            <div className='flex flex-col w-full gap-2' id='book'>
              <span className='text-[#1c1c1c] text-xs font-normal leading-none'>
                &lt;{post?.books.title}&gt; -{' '}
                {post?.books.author.replace(/\(Authors?\)/g, '').trim()}
              </span>
              <span className='text-[#1c1c1c] text-base font-medium leading-snug max-h-[5rem] overflow-scroll'>
                {post?.content}
              </span>
            </div>
            <div className='py-1.5 flex justify-start items-center gap-2 w-full' id='icons'>
              <img alt='likes' src='/empty-heart.svg' />
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
          className='flex flex-col h-[40%] w-[80%] overflow-scroll gap-2 justify-end'
          id='comments'
        >
          {post?.comment.map(
            (com: {
              comment_id: string;
              content: string;
              user_id: string;
              userinfo: { username: string; profile_url: string };
            }) => (
              <div
                className='px-2 py-2 bg-[#fcfcfc] rounded justify-start items-start gap-2.5 inline-flex'
                key={com.comment_id}
              >
                <img
                  alt='user-profile'
                  className='relative w-8 h-8 rounded-2xl'
                  src={com.userinfo.profile_url || '/default-userprofile.png'}
                />
                <div className='inline-flex flex-col items-center justify-center gap-1 grow shrink basis-0'>
                  <div className="self-stretch text-[#1c1c1c] text-xs font-normal font-['Inknut Antiqua'] leading-none">
                    {com.userinfo.username}
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
              createNewComment();
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
