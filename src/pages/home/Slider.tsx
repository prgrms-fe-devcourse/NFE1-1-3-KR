import SliderItem from './SliderItem';

import { useSlider } from 'hooks';
import type { BookData } from 'types';

import './styles.css';

const Slider = ({ data }: { data: BookData[] }) => {
  const { sliderRef } = useSlider({ data });

  return (
    <>
      <div className='slider absolute bottom-0 w-full h-[35vh]' ref={sliderRef}>
        <div className='wheel absolute top-0 flex items-center justify-center w-[1000vw] aspect-[1/1] max-w-[2000px] max-h-[2000px] left-1/2 transform -translate-x-1/2'>
          {data.slice(0, 14).map((bookData, index) => {
            return <SliderItem alt='슬라이드 아이템' key={index} src={bookData.cover as string} />;
          })}
        </div>
      </div>
      <div className='modal' data-flip-id='wheel__card'></div>
    </>
  );
};

export default Slider;
