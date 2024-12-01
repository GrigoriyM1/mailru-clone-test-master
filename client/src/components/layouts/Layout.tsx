import { PropsWithChildren } from 'react';
import { GetCategories, Header } from '@/components/shared';

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<GetCategories>
			<Header />
			<main className='max-w-[1300px] mx-auto px-3'>{children}</main>
		</GetCategories>
	);
};

export default Layout;
