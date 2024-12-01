import { 
	Textarea,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Label,
	Spinner,
	Button,
	FormField,
	QuilEditor,
} from '@/components/ui';
import { upperFirstLetter } from '@/lib';
import './Question.scss';
import cn from 'clsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { questionsService } from '@/services';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { IQuestionForm, IError } from '@/types';
import { askQuestionSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSocket } from '@/hooks';
import { toast } from 'sonner';

export const QuestionAsk = () => {
	const {
		register,
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<IQuestionForm>({
		resolver: zodResolver(askQuestionSchema),
		mode: 'onChange',
	});
	const { text, themeText, category, subcategory } = useWatch({ control });
	const { push } = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isThemeError, setIsThemeError] = useState(false);
	const [isTextError, setIsTextError] = useState(false);
	const { socket } = useSocket();

	const { data: categories, isPending } = useQuery({
		queryKey: ['categories'],
		queryFn: () => {
			return questionsService.getCategories();
		},
	});

	const { mutate } = useMutation({
		mutationKey: ['create-question'],
		mutationFn: (data: IQuestionForm) => questionsService.create(data),
		onSuccess(data) {
			socket?.emit('newQuestion', data);
			push(`/question/${data?.id}`);
		},
		onError(err: IError) {
			setIsLoading(false);

			if (err.response?.data?.type === 'no_points') {
				toast.error(err.response?.data?.message);
			}
		},
	});

	const onSubmit = (data: IQuestionForm) => {
		setIsLoading(true);
		mutate(data);
	};

	const handleInputsChange = (type: keyof IQuestionForm, e: any) => {
		register(type).onChange(e);
	};

	return (
		<div>
			{isPending ? (
				<div>
					<Spinner />
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)}>
					<Textarea
						id='question-theme'
						label='Тема вопроса'
						required
						className='text-[15px]'
						maxLength={120}
						divProps={{
							className: 'mb-6',
						}}
						error={!!errors?.themeText}
						helperText={errors?.themeText?.message}
						setIsError={setIsThemeError}
						{...register('themeText')}
						onChange={e => {
							e.target.value = upperFirstLetter(e.target.value);
							// register('themeText').onChange(e);
							handleInputsChange('themeText', e);
						}}
					/>

					<Controller
						name='text'
						control={control}
						render={({ field }) => (
							<QuilEditor
								id='question-text'
								label='Текст вопроса'
								className='text-[15px]'
								maxLength={3800}
								setIsError={setIsTextError}
								onChange={(value, delta, source, editor) => {
									field.onChange(value, delta, source, editor);
								}}
								value={field.value}
							/>
						)}
					/>

					<div className={'flex justify-between gap-4 mt-6'}>
						<div className='w-full'>
							<Label className='text-[18px] font-semibold text-black mb-1 w-full'>
								Категория <span className='text-red-600'>*</span>
							</Label>

							<FormField
								control={control}
								name='category'
								render={({ field }) => (
									<Select
										onValueChange={e => {
											field.onChange(e);
											setValue('subcategory', '');
										}}
										value={field.value}
									>
										<SelectTrigger
											className={cn(
												'w-full h-[50px] text-[17px] ask-question-select-trigger',
												!category && 'text-gray-400'
											)}
										>
											<SelectValue placeholder='Выберите категорию' />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{categories &&
													Object?.keys(categories)?.map(key => (
														<SelectItem value={key} key={key}>
															{categories[key].name}
														</SelectItem>
													))}
											</SelectGroup>
										</SelectContent>
									</Select>
								)}
							/>
						</div>
						<div className='w-full'>
							<Label className='text-[18px] font-semibold text-black mb-1 w-full'>
								Подкатегория <span className='text-red-600'>*</span>
							</Label>

							<FormField
								control={control}
								name='subcategory'
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										value={field.value}
										disabled={!category}
									>
										<SelectTrigger
											className={cn(
												'w-full h-[50px] text-[17px] ask-question-select-trigger',
												!subcategory && 'text-gray-400'
											)}
										>
											<SelectValue placeholder='Выберите подкатегорию' />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{category &&
													categories?.[category] &&
													Object.keys(categories?.[category]).map(
														key =>
															key !== 'name' && (
																<SelectItem value={key} key={key}>
																	{categories[category][key]}
																</SelectItem>
															)
													)}
											</SelectGroup>
										</SelectContent>
									</Select>
								)}
							/>
						</div>
					</div>

					<Button
						size='lg'
						className='mt-6 mb-9'
						disabled={
							!text ||
							!themeText ||
							!category ||
							!subcategory ||
							!!Object.keys(errors).length ||
							isThemeError ||
							isTextError
						}
						isLoading={isLoading}
						type='submit'
					>
						Опубликовать вопрос
					</Button>

					{/* TODO: ПОТОМ СДЕЛАТЬ ЭТО */}
					{/* <div className='flex items-center gap-3 cursor-pointer mb-3'>
						<Checkbox id='get-notifications' checked />
						<label htmlFor='get-notifications' className='cursor-pointer'>
							Получать уведомления (ответы, голоса, комментарии)
						</label>
					</div>
					<div className='flex items-center gap-3 cursor-pointer'>
						<Checkbox id='allow-comments' checked />
						<label htmlFor='allow-comments' className='cursor-pointer'>
							Разрешить комментарии к ответам
						</label>
					</div> */}
				</form>
			)}
		</div>
	);
};