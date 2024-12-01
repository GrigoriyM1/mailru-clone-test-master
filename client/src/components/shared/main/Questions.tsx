import { useQuery } from '@tanstack/react-query';
import Question from './Question';
import { questionsService } from '@/services';
import QuestionSkeleton from './QuestionSkeleton';
import { useEffect, useState } from 'react';
import { MoveDown } from 'lucide-react';
import { Spinner } from '@/components/ui';
import { IQuestion } from '@/types';
import { useParams, usePathname } from 'next/navigation';
import NewQuestions from './NewQuestions';
import cn from 'clsx';

export const Questions = () => {
	const pathname = usePathname();
	const { category } = useParams();

	const [skip, setSkip] = useState(0);
	const take = 20;

	const {
		data = [],
		isPending,
		refetch,
	} = useQuery({
		queryKey: ['questions', category, skip],
		queryFn: () => {
			return category === 'smstop'
				? questionsService.getLeaders({})
				: questionsService.getAll(category as string | undefined, skip, take);
		},
	});
	const [questions, setQuestions] = useState<IQuestion[] | null>(null);
	const [isShowMoreLoading, setIsShowMoreLoading] = useState(false);

	useEffect(() => {
		if (data) {
			if (skip === 0) {
				setQuestions(data);
			} else {
				setQuestions(prev => (prev ? [...prev, ...data] : data));
			}
			setIsShowMoreLoading(false);
		}
	}, [data, skip]);

	const handleShowMore = async () => {
		setIsShowMoreLoading(true);
		setSkip(prev => prev + take);
	};

	return (
		<div>
			{(pathname === '/' || pathname === '/category/open') && <NewQuestions />}

			{(isPending && !isShowMoreLoading) || !questions ? (
				<QuestionSkeleton />
			) : (
				<div>
					{questions.map(question => (
						<Question
							key={question.id}
							id={question.id}
							category={question.subcategory}
							createdAt={question.createdAt}
							userAvatar={question.user.avatar}
							theme={question.themeText}
							userId={question.userId}
							userName={question.user.name}
							userLastName={question.user.lastName}
							repliesCount={question.answers.length}
							isCategory={
								category === 'open' || category === 'best' || !category
							}
							likes={question.likes}
							userIsVip={question.user.isVip}
						/>
					))}
					{(data.length === take || isPending) && (
						<button
							className={cn(
								'w-full flex items-center justify-center gap-2 text-[17px] p-6 hover:cursor-pointer hover:underline',
								isShowMoreLoading && 'disabled'
							)}
							onClick={handleShowMore}
							disabled={isPending}
						>
							{isShowMoreLoading ? (
								<>
									<Spinner size='small' /> Загружаем...
								</>
							) : (
								<>
									<MoveDown size={14} /> Показать еще{' '}
								</>
							)}
						</button>
					)}
				</div>
			)}
		</div>
	);
};