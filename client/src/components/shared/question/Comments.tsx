import { IAnswer } from '@/types';
import AddComment from './AddComment';
import Comment from './Comment';
import { useEffect, useRef } from 'react';

interface ICommentsProps {
	answer: IAnswer;
}

const Comments: React.FC<ICommentsProps> = ({ answer }) => {
	const addCommentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (addCommentRef?.current) {
			const elementTopPosition = addCommentRef.current.getBoundingClientRect().top
			const offsetPosition = elementTopPosition + window.pageYOffset - 30; // - offset
			
			window.scrollTo({
				top: offsetPosition,
				left: 0,
			});
		}
	}, [addCommentRef.current]);

	return (
		<div>
			<div>
				{answer.comments.map(comment => (
					<Comment comment={comment} key={comment.id} />
				))}
			</div>

			<AddComment answer={answer} user={answer.user} ref={addCommentRef} />
		</div>
	);
};

export default Comments;
