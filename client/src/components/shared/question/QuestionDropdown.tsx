import { Dropdown } from '@/components/ui';
import { useModalsStore, useQuestionStore, useUserStore } from '@/store';
import { Pencil, SquarePen } from 'lucide-react';
import { getTimeLeft } from '@/lib';
import { useEffect, useState } from 'react';
import { ReportItem, DeleteItem, MakeLeaderItem } from '@/components/modules';
import { useParams } from 'next/navigation';

interface IQuestionDropdownProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	isMyQuestion: boolean;
}

let interval: NodeJS.Timeout | undefined;

const QuestionDropdown: React.FC<IQuestionDropdownProps> = ({
	isOpen,
	setIsOpen,
	isMyQuestion,
}) => {
	const {
		isAdditionalModalOpen,
		setIsAdditionalModalOpen,
		setIsEditQuestionModalOpen,
	} = useModalsStore();
	const { question } = useQuestionStore();
	const { id: questionId } = useParams();
	const [editTimeLeft, setEditTimeLeft] = useState(
		getTimeLeft(question?.createdAt!)
	);
	const { user } = useUserStore();

	const handleOpenAdditional = () => {
		setIsAdditionalModalOpen(!isAdditionalModalOpen);
		setIsOpen(false);
	};

	const handleOpenEditQuestionModal = () => {
		setIsEditQuestionModalOpen(true);
		setIsOpen(false);
	};

	useEffect(() => {
		interval = setInterval(() => {
			setEditTimeLeft(getTimeLeft(question?.createdAt!));

			if (getTimeLeft(question?.createdAt!) === '-0') {
				clearInterval(interval);
				setIsEditQuestionModalOpen(false);
			}
		}, 1000);

		return () => {
			if (interval) clearInterval(interval);
		};
	}, []);

	return (
		<Dropdown
			handleBtnId='#question-dropdown-open'
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			className='w-[250px] absolute top-7 right-0 bg-white shadow-big py-2'
		>
			{isMyQuestion ? (
				<>
					{getTimeLeft(question?.createdAt!) !== '-0' && (
						<div
							className='hover:bg-gray-200 p-3 cursor-pointer transition flex items-center gap-4 text-[15px]'
							onClick={handleOpenEditQuestionModal}
						>
							<Pencil className='w-[16px] h-[16px]' />
							<div className='flex items-center'>
								<div>Редактировать</div>
								<div className='ml-2'>{getTimeLeft(question?.createdAt!)}</div>
							</div>
						</div>
					)}
					<div
						className='hover:bg-gray-200 p-3 cursor-pointer transition flex items-center gap-4 text-[15px]'
						onClick={handleOpenAdditional}
					>
						<SquarePen className='w-[16px] h-[16px]' />
						<div>Дополнить</div>
					</div>
					<DeleteItem type='question' id={questionId as string} />
					<MakeLeaderItem id={questionId as string} />
				</>
			) : (
				<>
					{user?.isAdmin && (
						<>
							<DeleteItem type='question' id={questionId as string} />
							<MakeLeaderItem id={questionId as string} />
						</>
					)}
					<ReportItem
						type='QUESTION'
						elementId={question?.id!}
						elementLinkId={question?.id!}
					/>
				</>
			)}
		</Dropdown>
	);
};

export default QuestionDropdown;
