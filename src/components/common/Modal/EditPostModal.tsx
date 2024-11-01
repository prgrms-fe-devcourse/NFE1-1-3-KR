import { WritePost } from 'pages/community/WritePost';

export const EditPostModal = () => {
  return (
    <div className='flex items-center justify-center'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg'>
        <div className='mb-8 text-center'>
          <h2 className='mb-2 text-2xl font-bold text-gray-900'>Edit</h2>
        </div>
        <div>
          <WritePost edit initialContent={'initialContent'} />
        </div>
      </div>
    </div>
  );
};
