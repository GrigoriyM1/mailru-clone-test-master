import { IAnswer } from '@/types';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { formatCreatedAt } from '@/lib';
import { EllipsisVertical, Heart, MessageSquareMore, Star } from 'lucide-react';
import AnswerDropdown from './AnswerDropdown';
import { useQuestionStore, useUserStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import cn from 'clsx';
import { answerService, notificationService } from '@/services';
import { toast } from 'sonner';
import { useState } from 'react';
import EditAnswer from './EditAnswer';
import { Avatar } from '@/components/modules';
import Comments from './Comments';
import { useSocket } from '@/hooks';
import { useParams } from 'next/navigation';

interface IAnswerProps {
	isBestAnswerAllowed: boolean;
}

const Answer: React.FC<IAnswer & IAnswerProps> = props => {
	const { user: currentUser } = useUserStore();
	const { question } = useQuestionStore();
	const { socket } = useSocket();
	const { id } = useParams();

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isComment, setIsComment] = useState(false);

	const queryClient = useQueryClient();

	const isMyQuestion = currentUser?.id === question?.user.id;

	const likeMutation = useMutation({
		mutationKey: ['like-answer'],
		mutationFn: () => answerService.like(props.id),
		onSuccess(data) {
			queryClient.invalidateQueries({ queryKey: [`get-one-question`] });
			socket?.emit('questionChanged', { questionId: id });

			if (
				data.likedBy.find(item => item.id === currentUser?.id) &&
				!isMyQuestion
			) {
				notificationService.create({
					avatars: [currentUser?.avatar || (currentUser?.name as string)],
					title: 'Понравился ваш ответ на вопрос',
					text: question?.themeText!,
					subtitle: `${currentUser?.name} ${currentUser?.lastName}`,
					url: `/question/${id}`,
					userId: data?.userId!,
				});
			}

			if (
				data.likedBy.find(item => item.id === currentUser?.id) &&
				isMyQuestion
			) {
				notificationService.create({
					type: 'POINTS',
					points: 5,
					avatars: [],
					title: 'Автору вопроса понравился ваш ответ. Вам начислены +5 баллов',
					text: question?.themeText!,
					subtitle: `${currentUser?.name} ${currentUser?.lastName}`,
					url: `/question/${id}`,
					userId: data?.userId!,
				});
			}
		},
	});

	const bestAnswerMutation = useMutation({
		mutationKey: ['best-answer'],
		mutationFn: () => answerService.bestAnswer(props.id, question?.id!),
		async onSuccess(data) {
			queryClient.invalidateQueries({ queryKey: [`get-one-question`] });
			socket?.emit('questionChanged', { questionId: id });

			await notificationService.create({
				avatars: [],
				title:
					'Автор вопроса выбрал ваш ответ лучшим, вам начислено +10 баллов',
				type: 'POINTS',
				points: 10,
				subtitle: `${question?.user?.name} ${question?.user?.lastName}`,
				text: question?.themeText!,
				url: `/question/${id}`,
				userId: data?.userId!,
			});

			socket?.emit('notificationChanged', { userId: data?.userId });
		},
	});

	const isLiked = props.likedBy.find(item => item.id === currentUser?.id);
	const handleLike = () => {
		if (isMyQuestion && isLiked) {
			return toast.error('Вы уже поблагодарили автора за ответ');
		}
		likeMutation.mutate();
	};

	const handleComment = () => {
		setIsComment(!isComment);
	};

	const handleBestAnswer = () => {
		bestAnswerMutation.mutate();
	};

	return (
		<div className='px-10 py-6 flex justify-between relative'>
			<div
				className={cn(
					'flex gap-4 w-full',
					props.isBestAnswer && 'border-l-4 border-solid border-green-600 pl-4'
				)}
			>
				<Avatar user={props.user} />

				{isEdit ? (
					<>
						<EditAnswer
							setIsEdit={setIsEdit}
							text={props.text}
							answerId={props.id}
						/>
					</>
				) : (
					<div className='w-full'>
						<div className='flex items-center'>
							<Link
								href={`/profile/${props.user?.id}`}
								className='text-[13px] font-semibold hover:underline'
							>
								{props.user?.name} {props.user?.lastName},
							</Link>
							<div className='ml-2 text-gray-400 text-[13px]'>
								{formatCreatedAt(props.createdAt!)}
							</div>
						</div>

						<div className='text-gray-400 text-[13px]'>Ученик</div>

						<pre
							className='my-3 text-[15px]'
							dangerouslySetInnerHTML={{ __html: props.text }}
						></pre>

						<div className='flex'>
							<Button
								variant='outline'
								className='flex items-center text-gray-500 gap-1'
								onClick={handleLike}
							>
								<Heart
									className={cn('min-w-4 min-h-4 max-w-4 max-h-4 text-black', {
										'fill-black': isLiked,
									})}
								/>
								<div className='ml-1'>{props.likes > 0 && props.likes}</div>
								Нравится
							</Button>
							<Button
								variant='outline'
								className='flex items-center text-gray-500 gap-1'
								onClick={handleComment}
							>
								<MessageSquareMore className='min-w-4 min-h-4 max-w-4 max-h-4 text-black' />
								{props.comments.length > 0
									? `${props.comments.length} Комментариев`
									: 'Комментировать'}
							</Button>
						</div>

						{isComment && (
							<>
								<Comments answer={props} />
							</>
						)}
					</div>
				)}
			</div>

			{isMyQuestion && props.isBestAnswerAllowed && (
				<Button
					variant='ghost'
					onClick={handleBestAnswer}
					className='absolute right-14'
				>
					Лучший ответ
					<Star className='ml-1 w-4 h-4' />
				</Button>
			)}

			{!isEdit && (
				<div
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					id={`question-dropdown-open-${props.id}`}
					className='absolute right-5'
				>
					<EllipsisVertical className='cursor-pointer' />
					<AnswerDropdown
						isOpen={isDropdownOpen}
						setIsOpen={setIsDropdownOpen}
						handleId={props.id}
						answerUser={props.user}
						isEdit={isEdit}
						setIsEdit={setIsEdit}
						answerId={props.id}
						answerText={props.text}
					/>
				</div>
			)}
		</div>
	);
};

export default Answer;
