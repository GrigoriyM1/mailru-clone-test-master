import { ReportItem, DeleteItem } from '@/components/modules';
import { Dropdown } from '@/components/ui';
import { useQuestionStore, useUserStore } from '@/store';
import { IMinUser } from '@/types';
import { Pencil } from 'lucide-react';

interface IAnswerDropdownProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	handleId: string;
	answerUser: IMinUser;
	isEdit: boolean;
	setIsEdit: (value: boolean) => void;
	answerId: string;
	answerText: string;
}

const AnswerDropdown: React.FC<IAnswerDropdownProps> = ({
	isOpen,
	setIsOpen,
	handleId,
	answerUser,
	isEdit,
	setIsEdit,
	answerId,
	answerText,
}) => {
	const { user } = useUserStore();
	const { question } = useQuestionStore();

	const isMyAnswer = answerUser?.id === user?.id;

	const handleIsEdit = () => {
		setIsEdit(true);
	};

	return (
		<Dropdown
			handleBtnId={`#question-dropdown-open-${handleId}`}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			className='w-[250px] absolute top-7 right-0 bg-white shadow-big py-2'
		>
			{isMyAnswer ? (
				<>
					<div
						className='hover:bg-gray-200 p-3 cursor-pointer transition flex items-center gap-4 text-[15px]'
						onClick={handleIsEdit}
					>
						<Pencil className='w-[16px] h-[16px]' />
						<div className='flex items-center'>
							<div>Редактировать</div>
						</div>
					</div>
					<DeleteItem id={answerId} type='answer' />
				</>
			) : (
				<>
					<ReportItem
						type='ANSWER'
						elementId={answerId}
						elementLinkId={question?.id!}
						title={answerText}
					/>
				</>
			)}
		</Dropdown>
	);
};

export default AnswerDropdown;
