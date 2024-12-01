import { Button, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';

export const AskQuestionMin = () => {
	const { push } = useRouter();

	return (
		<div className='flex mb-7'>
			<Input
				placeholder='Задайте свой вопрос здесь'
				size='lg'
				className='border-primary'
			/>
			<Button className='h-[48px]' onClick={() => push('/ask')}>
				Задать вопрос
			</Button>
		</div>
	);
};