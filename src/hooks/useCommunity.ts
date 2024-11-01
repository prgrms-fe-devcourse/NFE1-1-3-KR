import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createComment, deletePost, getPostById, getPostList, createPost, updatePost } from 'api';
import { addLike, removeLike } from 'api/postLike';
import { useSearchBookStore } from 'stores';

export const usePostList = () =>
  useQuery({
    queryKey: ['postList'],
    queryFn: getPostList,
  });

export const usePost = (postId: string) =>
  useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  });

export const useCreatePost = (content: string, bookId: string | undefined) => {
  const queryClient = useQueryClient();
  const { setBookId } = useSearchBookStore();

  return useMutation({
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
};

export const useUpdatePost = (postId: string, content: string) => {
  const queryClient = useQueryClient();

  return useMutation({
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
};

export const useDeletePost = (postId: string, onClose: (id: string | null) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
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
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, comment }: { postId: string; comment: string }) =>
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
};

export const useLikePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => addLike({ postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] }).catch(error => {
        console.error('Error invalidating queries:', error);
      });
    },
    onError: error => {
      console.error('Error liking post:', error);
    },
  });
};

export const useUnlikePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeLike({ postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] }).catch(error => {
        console.error('Error invalidating queries:', error);
      });
    },
    onError: error => {
      console.error('Error unliking post:', error);
    },
  });
};
