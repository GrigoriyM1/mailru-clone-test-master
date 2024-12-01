import Link from 'next/link';
import { toast } from 'sonner';

export const generateToast = ({
	points,
	questionText,
	createdAt = 'менее минуты назад',
	link,
}: {
	points: number;
	questionText: string;
	createdAt?: string;
	link: string;
}) => {
	return toast.success(
		<div className='flex gap-3 relative'>
			<Link href={link} className='absolute top-0 left-0 w-full h-full'></Link>
			<button
				onClick={e => {
					e.stopPropagation();
					toast.dismiss();
				}}
				className='absolute top-0 -right-5 text-black font-bold'
			>
				✕
			</button>

			<div>
				<div className='bg-green-500 text-white px-3 py-2 rounded-md text-[20px]'>
					+{points}
				</div>
			</div>

			<div className='text-black'>
				<div className='font-semibold text-[17px] leading-[20px] max-w-[235px] mb-2.5'>
					Вам начислено {points} балла за ответ на вопрос
				</div>

				<div className='text-[17px] text-primary mb-2.5'>{questionText}</div>

				<div className='text-[14px] text-gray-400'>{createdAt}</div>
			</div>
		</div>,
		{
			position: 'top-right',
			className:
				'top-[70px] bg-white outline-none border-none max-w-[350px] w-full',
			duration: 10000,
		}
	);
};
