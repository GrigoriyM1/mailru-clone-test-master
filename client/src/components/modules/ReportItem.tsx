import { adminsService } from '@/services';
import { useQuestionStore } from '@/store'
import { useMutation } from '@tanstack/react-query';
import { OctagonAlert } from 'lucide-react';
import { toast } from 'sonner';

interface IReportItemProps extends React.HTMLAttributes<HTMLDivElement> {
	type: 'QUESTION' | 'ANSWER';
	elementId: string;
	elementLinkId: string;
	title?: string;
	description?: string;
}

export const ReportItem: React.FC<IReportItemProps> = ({
	type,
	elementId,
	elementLinkId,
	title,
	description,
	...props
}) => {
	const { question } = useQuestionStore();
	const titleText = type === 'QUESTION' ? question?.themeText : title;
	const descriptionText = type === 'QUESTION' ? question?.text : description;
  const elementLink = `${process.env.NEXT_PUBLIC_CLIENT_URL}/question/${elementLinkId}`

	const reportItemMutation = useMutation({
		mutationKey: ['report'],
		mutationFn: () =>
			adminsService.report({
				type,
				elementId,
				elementLink,
				title: titleText!,
				description: descriptionText!,
			}),
		onSuccess() {
			toast.success('Жалоба успешно отправлена');
		},
	});

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		reportItemMutation.mutate();

		props?.onClick?.(e);
	};

	return (
		<div
			className='hover:bg-gray-200 p-3 cursor-pointer transition flex items-center gap-4 text-[15px]'
			{...props}
			onClick={handleClick}
		>
			<OctagonAlert className='w-[16px] h-[16px]' />
			<div>Пожаловаться</div>
		</div>
	);
};