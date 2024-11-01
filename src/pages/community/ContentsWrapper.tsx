import { useState } from 'react';

import { DetailPost } from './DetailPost';
import { Post } from './Post';
import { WritePost } from './WritePost';

import 'styles/scroll.css';
import { usePostList } from 'hooks';

export const ContentsWrapper = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const { data: posts } = usePostList();

  return (
    <div className='w-full h-full p-2'>
      <WritePost />
      {selectedPostId != null ? (
        <DetailPost onClose={setSelectedPostId} postId={selectedPostId} />
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
