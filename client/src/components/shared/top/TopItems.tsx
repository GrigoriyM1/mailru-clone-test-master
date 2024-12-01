import { Avatar } from '@/components/modules';
import { IMinUserWithPoints } from '@/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TopItemsSkeleton from './TopItemsSkeleton';

interface ITopItemsProps {
	users: IMinUserWithPoints[] | undefined;
	isPending: boolean;
}

export const TopItems: React.FC<ITopItemsProps> = ({ users, isPending }) => {
	const searchParams = useSearchParams();
	const typeParam = (searchParams.get('type') || 'activity') as
		| 'activity'
		| 'answersLength';

	return isPending ? (
		<TopItemsSkeleton />
	) : (
		<div className='flex flex-wrap bg-white'>
			{users?.map((user, index) => (
				<div
					className='w-[50%] flex p-4 gap-6 border-b border-gray-200'
					key={user.id}
				>
					<div>{index + 4}</div>

					<div className='flex gap-3'>
						<div>
							<Avatar user={user!} size='normal' />
						</div>
						<div>
							<Link href={`/profile/${user.id}`} className='text-primary block'>
								{user.name} {user.lastName}
							</Link>

							<div className='text-[14px] text-gray-400 my-1'>{user.level}</div>

							<div className='font-bold text-[17px]'>
								{typeParam === 'activity'
									? Number(user?.points).toLocaleString()
									: user?._count?.answers}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};