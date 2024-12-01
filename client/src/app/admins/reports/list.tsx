import { List, Datagrid, TextField, DeleteButton, UrlField, RichTextField } from 'react-admin';

export const ReportList = () => (
	<List>
		<Datagrid>
			<TextField source='id' />
			<TextField source='type' />
			<TextField source='elementId' />
			<UrlField source='elementLink' target='_blank' />
			<TextField source='title' />
			<RichTextField source='description' />
			<DeleteButton />
		</Datagrid>
	</List>
);
