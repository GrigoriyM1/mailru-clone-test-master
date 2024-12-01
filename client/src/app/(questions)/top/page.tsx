'use client';

import { Top3, TopParams, TopItems } from '@/components/shared';
import { ITopForm } from '@/types';
import { FormProvider, useForm } from 'react-hook-form';
import qs from 'qs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services';
import { Suspense } from 'react';

const LeadersPage = () => {
	const { push } = useRouter();
	const searchParams = useSearchParams();
	const typeParam = (searchParams.get('type') || 'activity') as
		| 'activity'
		| 'answersLength';
	const form = useForm<ITopForm>({
		mode: 'onChange',
		defaultValues: {
			type: typeParam,
		},
	});

	const { data, isPending } = useQuery({
		queryKey: ['top', typeParam],
		queryFn: () => userService.getLeaders(typeParam),
	});

	form.watch(data => {
		const queryString = qs.stringify({
			type: data.type,
		});
		push(`/top/?${queryString}`);
	});

	return (
		<div className='w-full'>
			<div>
				<div
					className='bg-blue-600 w-full h-[390px] p-6 mt-5'
					style={{ backgroundImage: 'url(/leaders-bg.svg)' }}
				>
					<h1 className='text-[24px] text-center mb-5 text-white'>
						Лидеры по активности
					</h1>
					{/* ставить неделю месяц в зависимости от параметров url d */}

					<Top3 users={data?.slice(0, 3)} isPending={isPending} />
				</div>

				<FormProvider {...form}>
					<TopParams />
				</FormProvider>
			</div>

			<TopItems users={data?.slice(3)} isPending={isPending} />
		</div>
	);
};

const LeadersPageSuspense = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LeadersPage />
		</Suspense>
	);
};

export default LeadersPageSuspense;
