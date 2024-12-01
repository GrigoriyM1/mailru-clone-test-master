import './leaders.scss';
import { Avatar } from '@/components/modules';
import Link from 'next/link';
import { IMinUserWithPoints } from '@/types';
import Top3Skeleton from './Top3Skeleton';
import { useSearchParams } from 'next/navigation';

interface ITop3Props {
	users: IMinUserWithPoints[] | undefined;
	isPending: boolean;
}

export const Top3: React.FC<ITop3Props> = ({ users, isPending }) => {
	const searchParams = useSearchParams();
	const typeParam = (searchParams.get('type') || 'activity') as
		| 'activity'
		| 'answersLength';

	return isPending ? (
		<Top3Skeleton />
	) : (
		<div className='flex px-[120px] justify-between align-bottom'>
			<div className='text-center flex flex-col justify-end'>
				<div className='relative'>
					<Avatar
						user={users?.[1]!}
						className='mx-auto w-[115px] h-[115px] text-[30px] border-[5px] border-gray-300 leaders-avatar-red'
					/>

					<div className='text-[14px] bg-gray-300 inline-block rounded-full w-6 h-6 text-center leading-6 absolute -bottom-2 left-1/2 -translate-x-1/2'>
						2
					</div>
				</div>
				<Link
					href='/profile/cm3e4wy7l0000wnpuhooepfym'
					className='max-w-[178px] block w-full hover:underline transition text-white mt-5 font-bold'
				>
					{`${users?.[1].name} ${users?.[1].lastName}`.length > 15
						? `${users?.[1].name} ${users?.[1].lastName}`.slice(0, 15) + '...'
						: `${users?.[1].name} ${users?.[1].lastName}`}
				</Link>
				<div className='text-gray-300 text-[13px]'>{users?.[1].level}</div>
				<div className='text-yellow-300 font-semibold text-[20px]'>
					{typeParam === 'activity'
						? Number(users?.[1].points).toLocaleString()
						: users?.[1]._count.answers}
				</div>
			</div>

			<div className='text-center flex flex-col justify-end'>
				<div className='relative'>
					<Avatar
						user={users?.[0]!}
						className='w-[140px] h-[140px] text-[30px] border-[6px] border-yellow-500 leaders-avatar mx-auto'
					/>

					<div className='text-[14px] bg-yellow-500 inline-block rounded-full w-6 h-6 text-center leading-6 absolute -bottom-2 left-1/2 -translate-x-1/2'>
						1
					</div>
				</div>
				<Link
					href='/profile/cm3e4wy7l0000wnpuhooepfym'
					className='max-w-[175px] block w-full hover:underline transition text-white mt-5 font-bold'
				>
					{`${users?.[0].name} ${users?.[0].lastName}`.length > 15
						? `${users?.[0].name} ${users?.[0].lastName}`.slice(0, 15) + '...'
						: `${users?.[0].name} ${users?.[0].lastName}`}
				</Link>
				<div className='text-gray-300 text-[13px]'>{users?.[0].level}</div>
				<div className='text-yellow-300 font-semibold text-[20px]'>
					{typeParam === 'activity'
						? Number(users?.[0].points).toLocaleString()
						: users?.[0]._count.answers}
				</div>
			</div>

			<div className='text-center flex flex-col justify-end'>
				<div className='relative'>
					<Avatar
						user={users?.[2]!}
						className='mx-auto w-[105px] h-[105px] text-[30px] border-[5px] border-amber-600 leaders-avatar-red-red'
					/>

					<div className='text-[14px] bg-amber-600 inline-block rounded-full w-6 h-6 text-center leading-6 absolute -bottom-2 left-1/2 -translate-x-1/2'>
						3
					</div>
				</div>

				<Link
					href='/profile/cm3e4wy7l0000wnpuhooepfym'
					className='max-w-[178px] block w-full hover:underline transition text-white mt-5 font-bold'
				>
					{`${users?.[2].name} ${users?.[2].lastName}`.length > 15
						? `${users?.[2].name} ${users?.[2].lastName}`.slice(0, 15) + '...'
						: `${users?.[2].name} ${users?.[2].lastName}`}
				</Link>
				<div className='text-gray-300 text-[13px]'>{users?.[2].level}</div>
				<div className='text-yellow-300 font-semibold text-[20px]'>
					{typeParam === 'activity'
						? Number(users?.[2].points).toLocaleString()
						: users?.[2]._count.answers}
				</div>
			</div>
		</div>
	);
};