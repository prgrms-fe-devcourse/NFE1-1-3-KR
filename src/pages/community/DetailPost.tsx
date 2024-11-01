export const DetailPost = ({ postId }: { postId: string }) => {
  return (
    <div className='relative flex items-end justify-center w-full h-full p-2'>
      <div className='absolute'>
        <img alt='bookcover' src='/default-bookcover.png' />
      </div>
      <div className='flex flex-col p-[2.5rem] items-end justify-center border-2 border-[#afa18b] rounded-[40px] gap-4'>
        <div className='flex flex-col gap-4' id='info'>
          <div className='flex gap-4' id='user'>
            <img
              alt='user-profile'
              className='relative w-10 h-10 rounded-full'
              src='https://via.placeholder.com/40x40'
            />
            <div className='text-[#1c1c1c] text-base font-normal leading-snug'>he2e2</div>
          </div>
          <div id='book'>
            <span className='text-[#1c1c1c] text-xs font-normal leading-none'>
              &lt;Book Title&gt; - Author
            </span>
            <span className='text-[#1c1c1c] text-base font-medium leading-snug'>content</span>
          </div>
          <div id='icons'></div>
        </div>
        <div id='comments'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div id='comment' key={index}></div>
          ))}
        </div>
        <div id='input'></div>
      </div>
    </div>
  );
};
