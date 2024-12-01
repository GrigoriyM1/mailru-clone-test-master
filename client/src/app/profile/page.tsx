'use client';

import { EditProfile } from '@/components/shared';
import { Spinner } from '@/components/ui';
import { useUserStore } from '@/store';

const EditProfilePage = () => {
	const { isLoading: isUserLoading } = useUserStore();

	return (
		<div className='bg-white p-8 rounded-lg mt-6'>
			<h1 className='text-[32px] mb-7 font-medium'>Личные данные</h1>

			{isUserLoading ? <Spinner /> : <EditProfile />}
		</div>
	);
};

export default EditProfilePage;

// todo: ТУТ ОСТАНОВИЛСЯ
// TODO: ЕЩЕ ЗАБЫЛ ОТВЕТЫ ОБЯЗАТЕЛЬНО В ПРОФИЛЕ ДЕЛАТЬ
