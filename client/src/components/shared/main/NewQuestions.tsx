import { useSocket } from '@/hooks';
import { Alert, AlertDescription } from '@/components/ui';
import { useState, useEffect } from 'react';
import { IQuestion } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

const NewQuestions = () => {
	const { socket } = useSocket();
	const [newQuestions, setNewQuestions] = useState<IQuestion[]>([]);

	const queryClient = useQueryClient();

	useEffect(() => {
		socket?.on('newQuestion', data => {
			setNewQuestions(prevQuestions => [data, ...prevQuestions]);
		});
	}, [socket]);

	const handleClick = () => {
		queryClient.invalidateQueries({ queryKey: ['questions'] });
		setNewQuestions([]);
	};

	return (
		!!newQuestions?.length && (
			<Alert variant='success' className='text-[16px]' onClick={handleClick}>
				<AlertDescription className='flex justify-center items-center'>
					Показать{' '}
					<div className='mx-1 px-[5px] py-[2px] bg-green-500 rounded-[5px] text-white text-[16px]'>
						{newQuestions.length}
					</div>{' '}
					новых вопросов
				</AlertDescription>
			</Alert>
		)
	);
};

export default NewQuestions;
