import { Questions, AskQuestionMin } from '@/components/shared';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import cn from 'clsx';

export const Category = () => {
	const { category, type } = useParams();
	const isBest = category === 'best' || type === 'best';

	const isOpenOrBest = category === 'best' || category === 'open';

	console.log('CATEGORYYY ')

	return (
		<div className='bg-white w-full'>
			<div className='p-10 pb-0 mb-6'>
				<h1 className='mb-7 text-[25px]'>
					{category === 'smstop' || isOpenOrBest || !category
						? 'Вопросы участников'
						: category}
				</h1>

				<AskQuestionMin />

				{category !== 'smstop' && (
					<div className='flex items-center'>
						<Link
							href={`${
								isOpenOrBest || !category
									? '/category'
									: '/category/' + category
							}/open`}
							className={cn(
								'block text-bold transition cursor-pointer p-3 rounded-md',
								!isBest && 'bg-gray-200'
							)}
						>
							Открытые
						</Link>
						<Link
							href={`${
								isOpenOrBest || !category
									? '/category'
									: '/category/' + category
							}/best`}
							className={cn(
								'block text-bold transition hover:bg-gray-200 cursor-pointer p-3 rounded-md',
								isBest && 'bg-gray-200'
							)}
						>
							Лучшие
						</Link>
					</div>
				)}
			</div>

			<Questions />
		</div>
	);
};