import { IUser } from '@/types';
import ProfileTop from './ProfileTop';
import ProfileQuestions from './ProfileQuestions';

interface IProfileProps {
	data: IUser | undefined;
	isAnswers?: boolean;
}

export const Profile: React.FC<IProfileProps> = ({ data, isAnswers }) => {
	return (
		<div className='bg-white w-full'>
			<ProfileTop data={data} />
			<ProfileQuestions data={data} isAnswers={isAnswers} />
		</div>
	);
};
