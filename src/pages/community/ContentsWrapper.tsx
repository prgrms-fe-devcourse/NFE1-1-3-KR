import { useQuery } from '@tanstack/react-query';

import { Post } from './Post';
import { WritePost } from './WritePost';

import 'styles/scroll.css';
import { getPostList } from 'api';
import { useAuthStore } from 'stores';

export const ContentsWrapper = () => {
  const userInfo = useAuthStore(state => state.userInfo);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['postList'],
    queryFn: getPostList,
    enabled: userInfo?.user_id !== undefined,
  });

  return (
    <div className='w-full h-full p-2'>
      <WritePost />
      {isLoading ? (
        <p>로딩</p>
      ) : (
        <div className='w-full h-full p-4 overflow-y-scroll'>
          {posts?.map(post => <Post key={post.post_id} post={post} />)}
        </div>
      )}
    </div>
  );
};
