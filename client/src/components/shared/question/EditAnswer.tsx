import { Button, QuilEditor } from '@/components/ui';
import { useSocket } from '@/hooks';
import { answerService } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface IEditAnswerProps {
	setIsEdit: (isEdit: boolean) => void;
	text: string;
	answerId: string;
}

const EditAnswer: React.FC<IEditAnswerProps> = ({
	setIsEdit,
	text,
	answerId,
}) => {
	const [editText, setEditText] = useState({
		text: text,
		html: text,
	});
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { id } = useParams();

	const handleChange = (
		value: string,
		_delta: any,
		_source: any,
		editor: any
	) => {
		setEditText({
			text: editor.getText(),
			html: value,
		});
	};

	const updateAnswerMutation = useMutation({
		mutationKey: ['update-answer'],
		mutationFn: () => answerService.update({ text: editText.html }, answerId),
		onSuccess() {
			setIsEdit(false);
			queryClient.invalidateQueries({ queryKey: ['get-one-question'] });
			socket?.emit('questionChanged', { questionId: id });
		},
	});

	const handleSubmit = () => {
		updateAnswerMutation.mutate();
	};

	return (
		<div className='w-full'>
			<QuilEditor
				className='mb-2'
				value={editText.html}
				onChange={handleChange}
			/>
			<div className='flex items-center gap-2'>
				<Button
					variant='ghost'
					disabled={editText.text.trim().length < 6}
					onClick={handleSubmit}
					isLoading={updateAnswerMutation.isPending}
				>
					Сохранить
				</Button>
				<Button
					variant='outline'
					className='text-gray-400'
					onClick={() => setIsEdit(false)}
				>
					Отмена
				</Button>
			</div>
		</div>
	);
};

export default EditAnswer;
