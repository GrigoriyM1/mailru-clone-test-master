import { useModalsStore } from '@/store'
import AdditionalModal from './modals/AdditionalModal';
import EditQuestionModal from './modals/EditQuestionModal';
import LikedByModal from './modals/LikedByModal';
import LoginModal from './modals/LoginModal';
import EditProfileModal from './modals/EditProfileModal';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Modals = () => {
	const {
		isEditQuestionModalOpen,
		isEditProfileModalOpen,
		setIsLoginModalOpen,
		setIsLikedByModalOpen,
		setIsAdditionalModalOpen,
		setIsEditProfileModalOpen,
		setIsEditQuestionModalOpen,
	} = useModalsStore();
	const pathname = usePathname();

	useEffect(() => {
		setIsLoginModalOpen(false);
		setIsLikedByModalOpen(false);
		setIsAdditionalModalOpen(false);
		setIsEditProfileModalOpen(false);
		setIsEditQuestionModalOpen(false);
	}, [pathname]);

	return (
		<>
			<LoginModal />
			<LikedByModal />
			<AdditionalModal />
			{isEditQuestionModalOpen && <EditQuestionModal />}
			{isEditProfileModalOpen && <EditProfileModal />}
		</>
	);
};

export default Modals;
