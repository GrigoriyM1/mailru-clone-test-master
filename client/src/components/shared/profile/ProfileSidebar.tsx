import { Camera, UserRoundPen } from 'lucide-react';
import Link from 'next/link';
import { IUser } from '@/types';
import { useProfileStore, useModalsStore } from '@/store';
import VipStatusBtn from './VipStatusBtn';

interface IProfileSidebarProps {
	isMyProfile: boolean;
	data: IUser | undefined;
}

export const ProfileSidebar: React.FC<IProfileSidebarProps> = ({
	isMyProfile,
	data,
}) => {
	const { setIsEditProfileModalOpen } = useModalsStore();
	const { profileQuestions, profileAnswers } = useProfileStore();
	const QUESTIONS_URL = `/profile/${data?.id}/questions/all`;

	return (
		<div className='max-w-[280px] w-full p-4 pt-6'>
			<div className='border-b border-solid border-gray-300 pb-2'>
				<Link
					href={QUESTIONS_URL}
					className='w-full px-6 py-2 flex justify-between hover:bg-gray-300 transition rounded-sm'
				>
					Вопросы
					<span className='p-2 py-1 bg-gray-300 rounded-sm text-[13px]'>
						{profileQuestions?.questionsLength ||
						profileQuestions?.questionsLength == 0
							? profileQuestions?.questionsLength
							: null}
						{profileAnswers?.questionsLength ||
						profileAnswers?.questionsLength == 0
							? profileAnswers?.questionsLength
							: null}
						{/* TODO: СЮДА ДОБАВИТЬ ТУТ ОСТАНОВИЛСЯ */}
					</span>
				</Link>
				<Link
					href={`/profile/${data?.id}/answers/all`}
					className='w-full px-6 py-2 flex justify-between hover:bg-gray-300 transition rounded-sm'
				>
					Ответы
					<span className='p-2 py-1 bg-gray-300 rounded-sm text-[13px]'>
						{profileQuestions?.answersLength ||
						profileQuestions?.answersLength == 0
							? profileQuestions?.answersLength
							: null}
						{profileAnswers?.answersLength || profileAnswers?.answersLength == 0
							? profileAnswers?.answersLength
							: null}{' '}
					</span>
				</Link>
			</div>

			<div className='mt-3'>

				{isMyProfile && (
					<>
						<VipStatusBtn />
						
						<Link
							href='/profile'
							className='w-full cursor-pointer px-6 py-2 flex gap-2 hover:bg-gray-300 transition rounded-sm'
						>
							<Camera /> Изменить аватар
						</Link>

						<div
							className='cursor-pointer px-6 py-2 flex gap-2 hover:bg-gray-300 transition rounded-sm'
							onClick={() => setIsEditProfileModalOpen(true)}
						>
							<UserRoundPen /> Редактировать профиль
						</div>
					</>
				)}
			</div>
		</div>
	);
};