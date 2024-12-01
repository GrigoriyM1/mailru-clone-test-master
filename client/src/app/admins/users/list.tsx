import { List, Datagrid, TextField, DeleteButton, UrlField, RichTextField, BooleanField, NumberField, DateField } from 'react-admin';

export const UserList = () => (
	<List>
		<Datagrid>
			<TextField source='id' />
			<TextField source='name' />
			<TextField source='lastName' />
			<TextField source='email' />
			<TextField source='linkedEmail' />
			<UrlField source='avatar' />
			<TextField source='gender' />
			<TextField source='level' />
			<TextField source='description' />
			<NumberField source='points' />
			<BooleanField source='isAdmin' />
			<BooleanField source='isVip' />
			<DateField source='createdAt' />
			<DateField source='updatedAt' />

			{/* <DeleteButton /> */}
		</Datagrid>
	</List>
);
