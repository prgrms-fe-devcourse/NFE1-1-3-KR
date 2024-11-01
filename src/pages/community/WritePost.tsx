import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { createPost, updatePost } from 'api';
import { useModalDispatch } from 'context';
import { useAuthStore, useSearchBookStore, useModalStore, usePostStore } from 'stores';

export const WritePost = ({ edit = false }: { edit?: boolean }) => {
  const dispatch = useModalDispatch();
  const userInfo = useAuthStore(state => state.userInfo);
  const { bookId, setBookId } = useSearchBookStore();
  const { closeModal } = useModalStore();
  const { postId, postContent } = usePostStore();

  const [content, setContent] = useState(postContent || '');

  const queryClient = useQueryClient();

  const { mutate: createNewPost } = useMutation({
    mutationFn: () =>
      createPost({
        title: '',
        content: content,
        book_id: bookId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postList'] }).catch(error => {
        console.error('Error invalidating queries:', error);
      });
      setBookId(undefined);
    },
    onError: error => {
      console.error('Error creating post:', error);
    },
  });

  const { mutate: updatePostContent } = useMutation({
    mutationFn: () =>
      updatePost({ postId: postId ?? '', formData: { title: '', content: content } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] }).catch(error => {
        console.error('Error invalidating queries:', error);
      });
    },
    onError: error => {
      console.error('Error updating post:', error);
    },
  });

  return (
    <div className='p-2 rounded-[60px] border-2 border-[#243868] justify-between items-start inline-flex w-full'>
      <div className='flex items-center self-stretch justify-start gap-4 grow shrink basis-0'>
        <img
          alt="user's profile"
          className='w-10 h-10 relative rounded-[100px] border border-[#ecf0f5]'
          src={userInfo?.profile_url || '/default-userprofile.png'}
        />
        <input
          className='h-[33px] px-0.5 py-2 justify-start items-center gap-2.5 w-full text-sm'
          onChange={e => {
            setContent(e.target.value);
          }}
          placeholder="What's on your mind?"
          type='text'
          value={content}
        />
      </div>
      <div className='flex items-center justify-end h-full gap-5'>
        {!edit && (
          <div
            className='flex items-center justify-start gap-2 cursor-pointer'
            onClick={() => {
              dispatch({ type: 'OPEN_MODAL' });
            }}
          >
            <img alt='search-book' className='w-5 h-5' src='/bookmark-search.svg' />

            <button className='text-[#27364b] text-xs font-normal leading-none hidden md:block'>
              Add Book
            </button>
          </div>
        )}
        <div
          className='py-2.5 px-5 bg-[#243868] rounded-[100px] justify-center items-center gap-2.5 flex cursor-pointer'
          onClick={() => {
            if (edit) {
              updatePostContent();
              closeModal('EDIT');
            } else {
              createNewPost();
            }
          }}
        >
          <div className='text-sm font-normal leading-tight text-white'>Post</div>
        </div>
      </div>
    </div>
  );
};
