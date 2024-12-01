import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	Button,
	Badge,
	Spinner,
} from '@/components/ui';
import { Bell, StickyNote } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { useUserStore } from '@/store';
import { useQuery, useMutation } from '@tanstack/react-query';
import { notificationService } from '@/services';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks';

export default function Notifications() {
	const { user } = useUserStore();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const { socket } = useSocket();

	const { data, refetch, isPending } = useQuery({
		queryKey: ['get-notifications'],
		queryFn: () => notificationService.getAll(),
	});

	const readAllMutation = useMutation({
		mutationFn: () => notificationService.readAll(),
		onSuccess() {
			refetch();
		},
	});

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	useEffect(() => {
		socket?.emit('joinNotification', { userId: user?.id }); // тут остановился
		socket?.on('notificationChanged', data => {
			refetch();
			// todo: потом можно сделать уведомление на каждое и toast
		});
	}, [socket]);

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen) {
			readAllMutation.mutate();
		}
	};

	const readItems = data?.filter(item => !item.isRead);

	return (
		<DropdownMenu onOpenChange={handleOpenChange} open={open}>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon' className='relative'>
					{isPending ? (
						<>
							<Spinner />
						</>
					) : (
						<>
							<Bell className='h-5 w-5' />
							{!!readItems?.length && readItems.length > 0 && (
								<Badge className='absolute -top-2 -right-2 rounded-full bg-red-500 hover:bg-red-500 text-white px-2 py-0.5 text-xs font-medium'>
									{readItems?.length}
								</Badge>
							)}
						</>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[400px] shadow-big p-0'>
				<div className='max-h-[337px] overflow-auto narrow-scroll'>
					{isPending ? (
						<div className='p-10 text-center'>
							<Spinner />
						</div>
					) : !!data?.length && data.length > 0 ? (
						data?.map(item => <NotificationItem key={item.id} {...item} />)
					) : (
						<div className='p-10 text-center'>
							<StickyNote className='mx-auto w-[42px] h-[42px]' />
							<div className='mt-5 mb-4 font-bold text-[17px]'>
								Новых событий нет
							</div>
							<div className='text-[15px] max-w-[280px] mx-auto'>
								Задавайте свои вопросы и отвечайте на чужие. Здесь вы увидите
								уведомления о новых ответах на ваши вопросы и оценках ваших
								вопросов и ответов.
							</div>
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
