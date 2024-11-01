import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Post } from './Post';
import { WritePost } from './WritePost';

import 'styles/scroll.css';
import { getPostList } from 'api';
import { useAuthStore } from 'stores';

export const ContentsWrapper = () => {
  const userInfo = useAuthStore(state => state.userInfo);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['postList'],
    queryFn: getPostList,
    enabled: userInfo?.user_id !== undefined,
  });

  return (
    <div className='w-full h-full p-2'>
      <WritePost />
      {selectedPostId != null ? (
        <div>선택</div>
      ) : (
        <div className='w-full h-full p-4 overflow-y-scroll'>
          {posts?.map(post => (
            <div
              key={post.post_id}
              onClick={() => {
                setSelectedPostId(post.post_id as string);
              }}
            >
              <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
