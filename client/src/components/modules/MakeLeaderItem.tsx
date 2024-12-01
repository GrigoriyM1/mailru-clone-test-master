import { Star } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsService } from '@/services';
import { toast } from 'sonner';
import { useSocket } from '@/hooks';
import { useQuestionStore } from '@/store'

interface IMakeLeaderItemProps {
	id: string;
}

export const MakeLeaderItem: React.FC<IMakeLeaderItemProps> = ({ id }) => {
	const { socket } = useSocket();
	const queryClient = useQueryClient();
	const { question } = useQuestionStore();

	const makeLeaderMutation = useMutation({
		mutationKey: ['make-leader-item'],
		mutationFn: () => questionsService.makeLeader(id),
		onSuccess: () => {
			toast.success('Вы успешно сделали вопрос лидером!');
			queryClient.invalidateQueries({ queryKey: ['questions'] });
			// queryClient.invalidateQueries({ queryKey: ['get-one-question'] });
			socket?.emit('questionChanged', { questionId: id });
		},
		onError: () => {
			toast.error('У вас нету vip подписки!');
		},
	});

	const handleClick = () => {
		makeLeaderMutation.mutate();
	};

	if (question?.isLeader) return;
	return (
		<div
			className='hover:bg-gray-200 p-3 cursor-pointer transition flex items-center gap-4 text-[15px]'
			onClick={handleClick}
		>
			<Star className='w-[16px] h-[16px]' fill='black' />
			<div>Сделать лидером</div>
		</div>
	);
};