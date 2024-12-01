import { Button, Input } from '@/components/ui';
import { ISearchForm } from '@/types';
import { useFormContext, useWatch } from 'react-hook-form';

export const SearchPageInput = () => {
	const { register, control } = useFormContext<ISearchForm>();
	const { category, subcategory } = useWatch({ control });

	return (
		<div className='flex items-center'>
			<Input size='lg' {...register('searchText')} />
			<Button
				size='lg'
				type='submit'
				disabled={!!category && category !== 'all' && !subcategory}
			>
				Искать
			</Button>
		</div>
	);
};