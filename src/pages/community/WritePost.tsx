import { useModalDispatch } from 'context';

export const WritePost = () => {
  const dispatch = useModalDispatch();

  return (
    <div className='p-2 rounded-[60px] border-2 border-[#243868] justify-between items-start inline-flex w-full'>
      <div className='flex items-center self-stretch justify-start gap-4 grow shrink basis-0'>
        <img
          alt="user's profile"
          className='w-10 h-10 relative rounded-[100px] border border-[#ecf0f5]'
          src='https://via.placeholder.com/40x40'
        />
        <input
          className='h-[33px] px-0.5 py-2 justify-start items-center gap-2.5 w-full text-sm'
          placeholder="What's on your mind?"
          type='text'
        />
      </div>
      <div className='flex items-center justify-end h-full gap-5'>
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
        <div className='py-2.5 px-5 bg-[#243868] rounded-[100px] justify-center items-center gap-2.5 flex cursor-pointer'>
          <div className='text-sm font-normal leading-tight text-white'>Post</div>
        </div>
      </div>
    </div>
  );
};
