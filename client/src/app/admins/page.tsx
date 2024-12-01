'use client';

import {
	Admin,
	Resource,
	DataProviderContext,
	DataProvider,
} from 'react-admin';
import { useUserStore } from '@/store'
import { redirect } from 'next/navigation';
import { ReportList } from './reports/list';
import { customDataProvider } from '@/api';
// import simpleRestProvider from 'ra-data-simple-rest';
// import { axiosWithAuth } from '@/api';
import { UserList } from './users/list';
import { UserEdit } from './users/edit';

const dataProvider = customDataProvider(
	`${process.env.NEXT_PUBLIC_SERVER_URL}/api`
);

const AdminsPage = () => {
	const { user, isLoading: isUserLoading } = useUserStore();
	if (isUserLoading) return null;
	if (!user?.isAdmin) return redirect('/');

	return (
		<Admin dataProvider={dataProvider}>
			<Resource
				name='report'
				recordRepresentation='title'
				list={ReportList}
				// create={ReportCreate}
				// edit={ReportEdit}
			/>
			<Resource
				name='user'
				recordRepresentation='title'
				list={UserList}
				edit={UserEdit}
			/>
		</Admin>
	);
};

export default AdminsPage;
