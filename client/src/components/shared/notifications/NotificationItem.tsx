import { Avatar } from '@/components/modules';
import { formatCreatedAt } from '@/lib';
import Link from 'next/link';

interface INotificationItemProps {
	title: string;
	text: string;
	url: string;
	avatars: string[];
	subtitle?: string;
	createdAt: string;
	type?: 'DEFAULT' | 'POINTS';
	points?: number;
}

const NotificationItem: React.FC<INotificationItemProps> = ({
	title,
	text,
	url,
	avatars,
	subtitle,
	createdAt,
	points,
}) => {
	return (
		<div className='flex transition hover:bg-gray-100 cursor-pointer p-3 relative'>
			<Link href={url} className='absolute top-0 left-0 w-full h-full'></Link>

			<div className='relative w-[70px]'>
				{avatars.length > 0 ? (
					avatars.map((avatar, index) => (
						<Avatar
							user={{
								name: avatar!,
								lastName: '',
								id: '1',
								avatar: avatar,
								isVip: false,
							}}
							className={`absolute top-${index * 2} left-${
								index * 2
							} hover:z-[1]`}
							key={index}
							isLink={false}
						/>
					))
				) : (
					<div className='bg-green-500 text-white text-center rounded-md w-[50px] h-[50px] leading-[50px] text-[20px]'>
						+{points}
					</div>
				)}
			</div>
			<div className='w-full'>
				<div className='font-bold max-w-[245px] w-full mb-2'>{title}</div>

				<div className='text-primary mb-2'>
					{text.length >= 100 ? text.slice(0, 100) + '...' : text}
				</div>

				<div className='flex flex-col gap-0.5'>
					{subtitle && (
						<div className='text-[13px] text-gray-400'>{subtitle}</div>
					)}
					<div className='text-[13px] text-gray-400'>
						{formatCreatedAt(createdAt)}
					</div>
				</div>
			</div>
		</div>
	);
};
export default NotificationItem;
