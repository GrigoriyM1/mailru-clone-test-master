import { Button, Input, Modal, Textarea } from '@/components/ui';
import { editProfileSchema } from '@/schemas';
import { userService } from '@/services';
import { useModalsStore, useUserStore } from '@/store';
import { IEditProfileForm } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

const EditProfileModal = () => {
	const { user, mutate: userMutate } = useUserStore();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IEditProfileForm>({
		defaultValues: {
			description: user?.description || '',
		},
		resolver: zodResolver(editProfileSchema),
		mode: 'onChange',
	});
	const { isEditProfileModalOpen, setIsEditProfileModalOpen } =
		useModalsStore();

	const queryClient = useQueryClient();

	const editProfileMutation = useMutation({
		mutationKey: ['edit-profile'],
		mutationFn: (data: IEditProfileForm) => userService.editProfile(data),
		onSuccess: data => {
			userMutate?.();
			queryClient.invalidateQueries({ queryKey: ['get-user-by-id', data.id] });
			onClose();
		},
	});

	const onClose = () => {
		setIsEditProfileModalOpen(false);
	};

	const onSubmit = (data: IEditProfileForm) => {
		editProfileMutation.mutate(data);
	};

	return (
		<Modal
			isOpen={isEditProfileModalOpen}
			onClose={onClose}
			className='w-[420px]'
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='flex justify-between mb-7'>
					<p className='text-[24px]'>Редактировать профиль</p>
					<X onClick={onClose} className='cursor-pointer' />
				</div>

				<div className='mb-5'>
					<Input
						label='Имя'
						id='profile-edit-name'
						labelProps={{
							className: 'text-[15px] font-bold text-black',
						}}
						disabled
						size='md'
						defaultValue={user?.name + ' ' + user?.lastName}
					/>
					<div className='text-[14px] text-gray-400'>
						Вы можете изменить имя в{' '}
						<Link href='/profile' className='text-primary'>
							общих настройках Mail
						</Link>
					</div>
				</div>

				<Textarea
					maxLength={250}
					label='В чем вы лучше всего разбираетесь?'
					id='profile-edit-description'
					{...register('description')}
					error={!!errors.description}
					helperText={errors.description?.message}
					divProps={{
						className: 'mb-8',
					}}
				/>

				<div className='flex gap-2'>
					<Button size='lg' type='submit'>
						Сохранить профиль
					</Button>
					<Button variant='ghost' onClick={onClose} size='lg'>
						Отмена
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default EditProfileModal;
