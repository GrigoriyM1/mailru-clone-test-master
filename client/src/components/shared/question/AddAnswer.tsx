import { QuilEditor, Button } from '@/components/ui';
import { useUserStore, useQuestionStore } from '@/store';
import { MessageSquareMore } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { IAnswerForm, IMinUser } from '@/types';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { answerService, notificationService } from '@/services';
import { Avatar } from '@/components/modules';
import { useSocket } from '@/hooks';
import { useParams } from 'next/navigation';
import { generateToast } from '@/lib';

const AddAnswer = () => {
	const { question: questionData } = useQuestionStore();
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<IAnswerForm>({
		mode: 'all',
	});
	const { user } = useUserStore();
	const [text, setText] = useState('');
	const { socket } = useSocket();
	const { id } = useParams();
	const { question } = useQuestionStore();

	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: () =>
			answerService.create({ text }, questionData?.id as string),
		onSuccess(data) {
			// queryClient.invalidateQueries({ queryKey: [`get-one-question`] });
			socket?.emit('questionChanged', { questionId: id });

			queryClient.invalidateQueries({ queryKey: ['questions'] });

			notificationService.create({
				avatars: [user?.avatar || (user?.name as string)],
				title: 'Новые ответы на вопрос',
				text: question?.themeText!,
				subtitle: `${user?.name} ${user?.lastName}`,
				url: `/question/${id}`,
				userId: question?.userId!,
			});

			generateToast({
				points: 3,
				questionText: 'Как потратить это',
				link: `/question/${id}`,
			});
		},
	});

	const onSubmit = () => {
		if (!text?.length || text?.length < 6) {
			return setError('text', {
				message: 'Минимальная длина ответа - 6 символов',
			});
		}
		if (text?.length > 3800) {
			return setError('text', {
				message: 'Максимальная длина ответа - 3800 символов',
			});
		}
		mutate();
	};

	return (
		<div className='p-10 bg-white max-w-full'>
			<div className='text-[24px] mb-7'>Ответить на вопрос</div>

			<div className='flex gap-5'>
				<Avatar user={user as IMinUser} />

				<form className='w-full' onSubmit={handleSubmit(onSubmit)}>
					<Controller
						name='text'
						control={control}
						render={({ field }) => (
							<QuilEditor
								className='h-[110px]'
								divProps={{
									className: 'mb-3',
								}}
								placeholder='Введите текст ответа'
								error={!!errors?.text}
								helperText={errors?.text?.message}
								onChange={(value, delta, source, editor) => {
									field.onChange(value, delta, source, editor);
									setText(editor.getText());
								}}
								value={field.value}
							/>
						)}
					/>

					<Button
						size='lg'
						className='flex items-center gap-2'
						type='submit'
						isLoading={isPending}
					>
						<MessageSquareMore
							size={23}
							className='stroke-primary'
							fill='white'
						/>
						Ответить
					</Button>
				</form>
			</div>
		</div>
	);
};

export default AddAnswer;
