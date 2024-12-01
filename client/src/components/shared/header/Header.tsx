import { useUserStore } from '@/store'
import HeaderBottom from './HeaderBottom';
import HeaderTop from './HeaderTop';

export const Header = () => {
	const { isAuth } = useUserStore();

	return (
		<header className='bg-white shadow-bottom'>
			<HeaderTop />
			{isAuth && <HeaderBottom />}
		</header>
	);
};
