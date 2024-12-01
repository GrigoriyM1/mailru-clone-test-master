'use client';

import {
	Profile,
	ProfileLoading,
	ProfileSidebar,
	ProfileSidebarLoading,
} from '@/components/shared';
import { questionsService, userService } from '@/services';
import { useProfileStore, useUserStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const ProfileQuestionsCategoryPage = () => {
	const { id, category, pageNumber } = useParams();
	const { user } = useUserStore();
	const { setProfileQuestions, setIsProfileQuestionsLoading } =
		useProfileStore();

	const { data, isPending } = useQuery({
		queryKey: ['get-user-by-id', id],
		queryFn: () => userService.getById(id as string),
	});

	const getQuestionsFromUser = useQuery({
		queryKey: ['get-questions-from-user', category, id, pageNumber],
		queryFn: () =>
			questionsService.getFromUser(
				id as string,
				category as string,
				pageNumber! === '1' || !pageNumber ? 0 : 20 * Number(pageNumber) // TODO: ТУТ ОСТАВНОИЛСЯ ТУТ ЭТА ОШИБКА
			),
	});
	const isMyProfile = data?.id === user?.id;

	useEffect(() => {
		if (getQuestionsFromUser.data) {
			setProfileQuestions(getQuestionsFromUser.data);
		}
		setIsProfileQuestionsLoading(getQuestionsFromUser.isPending);
	}, [getQuestionsFromUser.data, getQuestionsFromUser.isPending]);

	return (
		<div className='flex min-h-[100vh]'>
			{isPending ? (
				<ProfileSidebarLoading />
			) : (
				<ProfileSidebar isMyProfile={isMyProfile} data={data} />
			)}

			{isPending ? <ProfileLoading /> : <Profile data={data} />}
		</div>
	);
};
// TODO: ТУТ ОСТАВНОИЛСЯ

export default ProfileQuestionsCategoryPage;
