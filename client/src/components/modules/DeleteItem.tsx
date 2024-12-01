import { useSocket } from '@/hooks';
import { answerService, questionsService } from '@/services';
import { useUserStore } from '@/store'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface IDeleteItemProps {
	id: string;
	type: 'question' | 'answer';
}

export const DeleteItem: React.FC<IDeleteItemProps> = ({ id, type }) => {
	const { user } = useUserStore();
	const { push } = useRouter();
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { id: questionId } = useParams()

	const deleteMutation = useMutation({
		mutationKey: [`delete-${type}`, id],
		mutationFn: () =>
			type === 'question'
				? questionsService.delete(id)
				: answerService.delete(id),
		onSuccess: () => {
			toast.success(`Удалено успешно`);
			if (type === 'question') {
				queryClient.invalidateQueries({ queryKey: [`questions`] });
				queryClient.invalidateQueries({
					queryKey: [`get-questions-from-user`],
				});
				push('/');
			} else {
				socket?.emit('questionChanged', { questionId });
				queryClient.invalidateQueries({ queryKey: [`get-answers-from-user`] });
				queryClient.invalidateQueries({ queryKey: ['get-one-question'] });
			}
		},
		onError: () => {
			toast.error('У вас нет Vip подписки');
		},
	});

	const handleClick = () => {
		if (!user?.isVip) {
			if (!user?.isAdmin) return toast.error('У вас нет Vip подписки');
		}

		if (window.confirm('Вы уверены что хотите удалить ваш вопрос?')) {
			deleteMutation.mutate();
		}
	};

	return (
		<div
			className='hover:bg-gray-200 p-3 cursor-pointer transition flex items-center gap-4 text-[15px]'
			onClick={handleClick}
		>
			<Trash2 className='w-[16px] h-[16px]' />
			<div>Удалить</div>
		</div>
	);
};