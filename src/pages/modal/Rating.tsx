export const Rating = ({ rating }: { rating: number }) => {
  const maxRating = 5;
  const filledHearts = Math.round(rating / 2);

  return (
    <div className='flex space-x-0.5'>
      {Array.from({ length: maxRating }, (_, index) => (
        <img
          alt='heart'
          className='w-6 h-6'
          key={index}
          src={`/icon/${index < filledHearts ? 'heart.svg' : 'white-heart.svg'}`}
        />
      ))}
    </div>
  );
};
