import { questionsService } from '@/services';
import { useSearchStore } from '@/store'
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const GetCategories: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { setCategories, setIsCategoriesPending } = useSearchStore();

	const { data, isPending } = useQuery({
		queryKey: ['get-categories'],
		queryFn: () => questionsService.getCategories(),
	});

	useEffect(() => {
		setIsCategoriesPending(isPending);

		if (data) {
			setCategories(data);
		}
	}, [data, isPending]);

	return <>{children}</>;
};