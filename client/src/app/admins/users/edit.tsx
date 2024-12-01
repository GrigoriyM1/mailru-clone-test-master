import { Edit, SimpleForm, required, BooleanInput } from 'react-admin';

export const UserEdit = () => {
	return (
		<Edit>
			<SimpleForm>
				<BooleanInput source='isVip' validate={[required()]} />
				<BooleanInput source='isAdmin' validate={[required()]} />
			</SimpleForm>
		</Edit>
	);
};
