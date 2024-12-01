'use client';

import { questionsService } from '@/services';
import { useUserStore, useQuestionStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';
import { Question, QuestionLoading, Question404 } from '@/components/shared';
import { useEffect } from 'react';
import { IQuestion } from '@/types';

const QuestionPage = () => {
	const { id, category, type } = useParams();
	const { isLoading } = useUserStore();
	const { question, setQuestion } = useQuestionStore();
	const pathname = usePathname();

	const {
		data,
		isPending,
		isLoading: isQuestionLoading,
		isSuccess,
	} = useQuery({
		queryKey: ['get-one-question'],
		queryFn: () => questionsService.getOne(id as string),
		// refetchOnWindowFocus: true,
	});

	useEffect(() => {
		if (data) setQuestion(data as IQuestion | null);
	}, [isSuccess, data, pathname, id, isQuestionLoading, isPending]);

	return (
		<>
			{typeof data === 'string' && data?.length === 0 ? (
				<Question404 />
			) : isPending || isQuestionLoading || isLoading || !data || !question ? (
				<QuestionLoading />
			) : (
				<Question />
			)}

			{/* <QuestionLoading /> */}
		</>
	);
};

export default QuestionPage;
