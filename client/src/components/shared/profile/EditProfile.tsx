import {
	Button,
	FormField,
	Input,
	Label,
	RadioGroup,
	RadioGroupItem,
	SelectBirthdate,
} from '@/components/ui';
import { formatBirthdateString, formatTextInput } from '@/lib';
import { editProfilePageSchema } from '@/schemas';
import { userService } from '@/services';
import { useUserStore } from '@/store';
import { IEditProfilePageData, IEditProfilePageForm } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import EditProfileFileUpload from './EditProfileFileUpload';

export const EditProfile = () => {
	const { user, mutate: userMutate } = useUserStore();
	const {
		register,
		control,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<IEditProfilePageForm>({
		defaultValues: {
			name: user?.name,
			lastName: user?.lastName,
			birthdate: {
				day: formatBirthdateString(user?.birthdate!).day,
				month: formatBirthdateString(user?.birthdate!).month,
				year: formatBirthdateString(user?.birthdate!).year,
			},
			gender: user?.gender,
		},
		mode: 'onChange',
		resolver: zodResolver(editProfilePageSchema),
	});

	const queryClient = useQueryClient();

	const editProfilePageMutation = useMutation({
		mutationKey: ['edit-profile-page'],
		mutationFn: (data: IEditProfilePageData) =>
			userService.editProfilePage(data),
		onSuccess() {
			toast.success('Профиль успешно обновлен');
			userMutate?.();
			queryClient.invalidateQueries({ queryKey: ['get-user-by-id', user?.id] });
		},
	});

	const onSubmit = (data: IEditProfilePageForm) => {
		editProfilePageMutation.mutate({
			...data,
			birthdate: `${data.birthdate.day}.${data.birthdate.month}.${data.birthdate.year}`,
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='flex gap-20'>
			<EditProfileFileUpload />

			<div className='w-[500px]'>
				<Input
					label='Имя'
					id='profile-name'
					error={!!errors?.name}
					helperText={errors?.name?.message}
					{...register('name')}
					onChange={e => {
						formatTextInput(e);
						register('name').onChange(e);
					}}
					labelProps={{
						className: 'mb-1',
					}}
					divProps={{
						className: 'mb-5',
					}}
					size='md'
				/>

				<Input
					label='Фамилия'
					id='profile-lastName'
					error={!!errors?.lastName}
					helperText={errors?.lastName?.message}
					{...register('lastName')}
					onChange={e => {
						formatTextInput(e);
						register('lastName').onChange(e);
					}}
					divProps={{
						className: 'mb-5',
					}}
					labelProps={{
						className: 'mb-1',
					}}
					size='md'
				/>

				<div>
					<Label
						variant={!!errors?.birthdate ? 'error' : 'light'}
						className='mb-1'
					>
						Дата рождения
					</Label>
					<SelectBirthdate
						control={control}
						error={!!errors?.birthdate}
						errorText={
							errors?.birthdate?.message ||
							errors?.birthdate?.day?.message ||
							errors?.birthdate?.month?.message ||
							errors?.birthdate?.year?.message
						}
						setValue={setValue}
					/>
				</div>

				<div className='mt-5'>
					<Label className='mb-2'>Пол</Label>
					<FormField
						control={control}
						name='gender'
						render={({ field }) => (
							<RadioGroup
								className='flex gap-5'
								error={!!errors?.gender}
								helperText={errors?.gender?.message}
								value={field.value}
								onValueChange={field.onChange}
							>
								<div className='flex items-center'>
									<RadioGroupItem value='male' id='register-male' />
									<Label
										htmlFor='register-male'
										variant='normal'
										className='cursor-pointer pl-2'
									>
										Мужской
									</Label>
								</div>
								<div className='flex items-center'>
									<RadioGroupItem value='female' id='register-female' />
									<Label
										htmlFor='register-female'
										variant='normal'
										className='cursor-pointer pl-2'
									>
										Женский
									</Label>
								</div>
							</RadioGroup>
						)}
					/>
				</div>

				<Button
					type='submit'
					className='mt-8'
					disabled={editProfilePageMutation.isPending}
				>
					Сохранить
				</Button>
			</div>
		</form>
	);
};