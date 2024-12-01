import { Skeleton } from '@/components/ui';

const Top3Skeleton = () => {
  return (
    <div className='flex px-[120px] justify-between align-bottom'>
      <div className='text-center flex flex-col justify-end'>
        <div className='relative'>
          <Skeleton className='mx-auto w-[115px] h-[115px] rounded-full border-[5px] border-gray-300' />
          <Skeleton className='w-6 h-6 rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2' />
        </div>
        <Skeleton className='h-4 w-[163px] mx-auto mt-5' />
        <Skeleton className='h-3 w-[60px] mx-auto mt-2' />
        <Skeleton className='h-5 w-[80px] mx-auto mt-2' />
      </div>

      <div className='text-center flex flex-col justify-end'>
        <div className='relative'>
          <Skeleton className='w-[140px] h-[140px] rounded-full border-[6px] border-yellow-500 mx-auto' />
          <Skeleton className='w-6 h-6 rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2' />
        </div>
        <Skeleton className='h-4 w-[163px] mx-auto mt-5' />
        <Skeleton className='h-3 w-[60px] mx-auto mt-2' />
        <Skeleton className='h-5 w-[80px] mx-auto mt-2' />
      </div>

      <div className='text-center flex flex-col justify-end'>
        <div className='relative'>
          <Skeleton className='mx-auto w-[105px] h-[105px] rounded-full border-[5px] border-amber-600' />
          <Skeleton className='w-6 h-6 rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2' />
        </div>
        <Skeleton className='h-4 w-[163px] mx-auto mt-5' />
        <Skeleton className='h-3 w-[60px] mx-auto mt-2' />
        <Skeleton className='h-5 w-[80px] mx-auto mt-2' />
      </div>
    </div>
  );
};

export default Top3Skeleton;