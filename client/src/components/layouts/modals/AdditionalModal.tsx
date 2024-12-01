import { Button, Modal, QuilEditor } from '@/components/ui';
import { useSocket } from '@/hooks';
import { questionsService } from '@/services';
import { useModalsStore } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const AdditionalModal = () => {
	const {
		isAdditionalModalOpen,
		setIsAdditionalModalOpen,
		additionalQuestionId,
	} = useModalsStore();
	const [isError, setIsError] = useState(false);
	const [text, setText] = useState({
		text: '',
		html: '',
	});
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { id } = useParams();

	const { mutate, isPending } = useMutation({
		mutationFn: (variables: { id: string; additional: string }) =>
			questionsService.addAdditional(variables.id, variables.additional),
		onSuccess() {
			setIsAdditionalModalOpen(false);
			setText({
				html: '',
				text: '',
			});
			setIsError(false);

			queryClient.invalidateQueries({ queryKey: ['get-one-question'] });

			// socket?.emit('questionChanged', { questionId: id });
			socket?.emit('questionChanged', { questionId: id });
		},
	});
	// TODO: ДОПОЛНИТЬ ТОЖЕ ТАМ SOCKET IO НАВЕРНОЕ

	const onClose = () => {
		setIsAdditionalModalOpen(false);
	};

	const handleAddAdditional = () => {
		mutate({ id: additionalQuestionId as string, additional: text.html });
	};

	return (
		<Modal
			isOpen={isAdditionalModalOpen}
			onClose={onClose}
			className='max-w-[680px] w-full max-h-[80vh] overflow-y-auto'
		>
			<div className='flex justify-between'>
				<div className='text-[24px] mb-8'>Дополнить вопрос</div>

				<X className='cursor-pointer' onClick={onClose} />
			</div>

			<div>
				<QuilEditor
					className='h-[110px]'
					divProps={{
						className: 'mb-8',
					}}
					label='Текст дополнения'
					required
					maxLength={1800}
					setIsError={setIsError}
					value={text.html}
					onChange={(value, delta, source, editor) => {
						setText({
							text: editor.getText(),
							html: value,
						});
					}}
				/>

				<div className='flex gap-2'>
					<Button
						disabled={!text || isError || text.text.length < 6 || isPending}
						size='lg'
						onClick={handleAddAdditional}
					>
						Дополнить
					</Button>

					<Button
						onClick={() => {
							setText({
								html: '',
								text: '',
							});
							setIsAdditionalModalOpen(false);
						}}
						variant='ghost'
						size='lg'
					>
						Отмена
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default AdditionalModal;
