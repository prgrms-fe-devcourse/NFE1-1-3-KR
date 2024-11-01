import { useModalState, useModalDispatch } from 'context';

export const SearchModal = () => {
  const { isOpen } = useModalState();
  const dispatch = useModalDispatch();

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]'>
      <div className='p-2.5 bg-white rounded-lg flex-col justify-start items-start gap-2.5 inline-flex w-auto'>
        <div className='relative justify-start items-start gap-2.5 inline-flex flex-row'>
          <div className='h-9 p-2 bg-[#fcfcfc] rounded border border-[#afa18b] justify-start items-center gap-1.5 flex'>
            <img alt='search-icon' className='w-[15px] h-[15px] relative' src='/search-icon.svg' />
            <input
              className='text-[#959595] text-sm font-normal leading-tight'
              placeholder='What are you looking for?'
            />
          </div>
          <button
            className='w-9 h-9 bg-[#243868] rounded flex-col justify-center items-center gap-2.5 inline-flex'
            onClick={() => {
              dispatch({ type: 'CLOSE_MODAL' });
            }}
          >
            <img alt='close' src='/close.svg' />
          </button>
        </div>
        <div className='self-stretch h-[135px] flex-col justify-start items-start gap-2 flex'>
          <div className="text-black/50 text-[11px] font-medium font-['Manrope']">Results</div>
          <div className='self-stretch h-28 flex-col justify-start items-start gap-0.5 flex'>
            <div className='self-stretch p-2 rounded-lg justify-start items-center gap-1.5 inline-flex'>
              <img
                alt='bookcover'
                className='relative w-8 h-8 rounded'
                src='https://via.placeholder.com/32x32'
              />
              <div className='flex-col justify-center items-start gap-0.5 inline-flex'>
                <div className="text-[#3a3b3f] text-sm font-normal font-['Inknut Antiqua'] leading-tight">
                  First result
                </div>
                <div className="text-[#98999b] text-xs font-normal font-['Inknut Antiqua'] leading-none">
                  Created by Joey Pope
                </div>
              </div>
            </div>
            <div className='self-stretch p-2 rounded-lg justify-start items-center gap-1.5 inline-flex'>
              <img
                alt='bookcover'
                className='relative w-8 h-8 rounded'
                src='https://via.placeholder.com/32x32'
              />
              <div className='flex-col justify-center items-start gap-0.5 inline-flex'>
                <div className="text-[#3a3b3f] text-sm font-normal font-['Inknut Antiqua'] leading-tight">
                  Second result
                </div>
                <div className="text-[#98999b] text-xs font-normal font-['Inknut Antiqua'] leading-none">
                  Created by Anne Hawthorn
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
