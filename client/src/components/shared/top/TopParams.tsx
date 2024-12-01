import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	FormField,
} from '@/components/ui';
import { ITopForm } from '@/types';
import { useFormContext } from 'react-hook-form';

export const TopParams = () => {
	const { control } = useFormContext<ITopForm>();

	return (
		<div className='bg-blue-800 w-full px-5 py-2 flex flex-wrap gap-3'>
			<FormField
				control={control}
				name='type'
				render={({ field }) => (
					<Select onValueChange={field.onChange} value={field.value}>
						<SelectTrigger className={'w-full h-[50px]'}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value='activity'>По активности</SelectItem>
								<SelectItem value='answersLength'>
									По количеству ответов
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			/>
		</div>
	);
};