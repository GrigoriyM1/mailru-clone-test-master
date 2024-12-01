import { Skeleton } from '@/components/ui';

const TopItemsSkeleton = () => {
  return (
    <div className='flex flex-wrap bg-white'>
      {[...Array(6)].map((_, index) => (
        <div
          className='w-[50%] flex p-4 gap-6 border-b border-gray-200'
          key={index}
        >
          <div>{index + 4}</div>
          <div className='flex gap-3'>
            <div>
              <Skeleton className='w-[50px] h-[50px] rounded-full' />
            </div>
            <div>
              <Skeleton className='w-[150px] h-[20px] mb-2' />
              <Skeleton className='w-[100px] h-[16px] my-1' />
              <Skeleton className='w-[60px] h-[24px]' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopItemsSkeleton;