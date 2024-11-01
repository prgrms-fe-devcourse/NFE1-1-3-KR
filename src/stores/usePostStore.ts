import { create } from 'zustand';

type PostStore = {
  postId: string | undefined;
  postContent: string;
  setPostId: (postId: string | undefined) => void;
  setPostContent: (postContent: string) => void;
};

export const usePostStore = create<PostStore>(set => ({
  postId: undefined,
  postContent: '',
  setPostId: post => {
    set({ postId: post });
  },
  setPostContent: content => {
    set({ postContent: content });
  },
}));
