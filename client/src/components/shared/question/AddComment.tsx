import { Avatar } from '@/components/modules';
import { Button, QuilEditor } from '@/components/ui';
import { useSocket } from '@/hooks';
import { answerService, notificationService } from '@/services';
import { IMinUser, IAnswer } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquareMore } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, forwardRef } from 'react';

interface IAddCommentProps {
	answer: IAnswer;
	user: IMinUser;
}

const AddComment = forwardRef<HTMLDivElement, IAddCommentProps>(
	({ answer, user }, ref) => {
		const { id: answerId } = answer;

		const [commentText, setCommentText] = useState({
			text: '',
			html: '',
		});
		const { socket } = useSocket();
		const { id } = useParams();

		const queryClient = useQueryClient();

		const commentMutation = useMutation({
			mutationKey: ['comment-answer'],
			mutationFn: () => answerService.comment(answerId, commentText.html),
			onSuccess(data) {
				queryClient.invalidateQueries({ queryKey: [`get-one-question`] });
				setCommentText({
					text: '',
					html: '',
				});
				socket?.emit('questionChanged', { questionId: id });

				notificationService.create({
					avatars: [user?.avatar || (user?.name as string)],
					title: 'Новый ответ на ваш комментарий',
					text:
						answer.text.length >= 100
							? answer.text.slice(0, 100) + '...'
							: answer.text!,
					subtitle: `${user?.name} ${user?.lastName}`,
					url: `/question/${id}`,
					userId: answer?.userId!,
				});
			},
		});

		const handleComment = () => {
			commentMutation.mutate();
		};

		return (
			<div ref={ref}>
				<div className='bg-gray-100 w-full p-4 flex gap-3'>
					<div>
						<Avatar
							user={user}
							avatarFallbackProps={{ className: 'bg-pink-200' }}
						/>
					</div>
					<div className='w-full'>
						<QuilEditor
							className='mb-3'
							value={commentText.html}
							onChange={(value, delta, source, editor) => {
								setCommentText({
									text: editor.getText(),
									html: value,
								});
							}}
							placeholder='Написать комментарий'
						/>
						<Button
							variant='outline'
							className='flex gap-2 text-black'
							onClick={handleComment}
							disabled={commentText.text.length < 6}
							isLoading={commentMutation.isPending}
						>
							<MessageSquareMore className='w-5 h-5' />
							Комментировать
						</Button>
					</div>
				</div>
			</div>
		);
	}
);

export default AddComment;
