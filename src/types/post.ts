import type { Database } from './supabase';

type PostData = Database['public']['Tables']['posts']['Row'];

export interface CreatePostFormData extends Pick<PostData, 'title' | 'content'> {
  book_id?: string;
}

interface UpdatePostFormData extends Pick<PostData, 'title' | 'content'> {
  book_id?: string;
}

export interface UpdatePostParams {
  postId: string;
  formData: UpdatePostFormData;
}

export type PostDTO = {
  post_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  book_id: string | null;
  userinfo: {
    username: string | null;
    profile_url: string | null;
  };
  books: {
    id: string;
    title: string | null;
    author: string | null;
    isbn: string | null;
    cover: string | null;
  } | null;
};
