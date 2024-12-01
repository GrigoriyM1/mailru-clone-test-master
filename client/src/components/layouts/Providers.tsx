'use client';

import { PropsWithChildren, useState } from 'react';
import { Toaster } from 'sonner';
import Layout from './Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FetchUser from './FetchUser';
import Modals from './Modals';
import { usePathname } from 'next/navigation';

const Providers = ({ children }: PropsWithChildren) => {
	const pathname = usePathname();

	const isAdminPage = pathname.startsWith('/admins');

	const [client] = useState(
		new QueryClient({
			defaultOptions: { queries: { refetchOnWindowFocus: false } },
		})
	);

	return (
		<QueryClientProvider client={client}>
			<FetchUser>
				<Toaster position='bottom-left' theme='dark' />
				<Modals />

				{isAdminPage ? children : <Layout>{children}</Layout>}
			</FetchUser>
		</QueryClientProvider>
	);
};

export default Providers;
