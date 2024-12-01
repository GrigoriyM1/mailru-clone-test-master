'use client';

import {
	Profile,
	ProfileLoading,
	ProfileSidebar,
	ProfileSidebarLoading,
} from '@/components/shared';
import { answerService, userService } from '@/services';
import { useProfileStore, useUserStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const ProfileAnswersCategoryPage = () => {
	const { id, category, pageNumber } = useParams();
	const { user } = useUserStore();
	const { setProfileAnswers, setIsProfileAnswersLoading } = useProfileStore();

	const { data, isPending } = useQuery({
		queryKey: ['get-user-by-id', id],
		queryFn: () => userService.getById(id as string),
	});

	const getAnswersFromUser = useQuery({
		queryKey: ['get-answers-from-user', category, id, pageNumber],
		queryFn: () =>
			answerService.getFromUser(
				id as string,
				category as string,
				20 * Number(pageNumber) || 20
			),
	});
	const isMyProfile = data?.id === user?.id;

	useEffect(() => {
		if (getAnswersFromUser.data) {
			setProfileAnswers(getAnswersFromUser.data);
		}
		setIsProfileAnswersLoading(getAnswersFromUser.isPending);
	}, [getAnswersFromUser.data, getAnswersFromUser.isPending]);

	return (
		<div className='flex min-h-[100vh]'>
			{isPending ? (
				<ProfileSidebarLoading />
			) : (
				<ProfileSidebar isMyProfile={isMyProfile} data={data} />
			)}

			{isPending ? (
				<ProfileLoading />
			) : (
				<Profile data={data} isAnswers={true} />
			)}
		</div>
	);
};

export default ProfileAnswersCategoryPage;
