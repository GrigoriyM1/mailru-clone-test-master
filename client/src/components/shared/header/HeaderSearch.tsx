import { Button, Input } from '@/components/ui';
import { Search } from 'lucide-react';
import { useRef, useState } from 'react';
import cn from 'clsx';
import { useRouter } from 'next/navigation';

const HeaderSearch = () => {
	const [searchValue, setSearchValue] = useState('');
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [isFocused, setIsFocused] = useState(false);
	const { push } = useRouter();

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		push(`/search/${searchValue}`);
		searchInputRef.current?.focus();
	};

	return (
		<form
			onSubmit={handleSearch}
			className='max-w-[450px] w-full flex items-center'
		>
			<div className='max-w-[450px] w-full flex items-center'>
				<Input
					placeholder='Поиск по вопросам'
					className='w-full'
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					ref={searchInputRef}
				/>
				<Button
					variant='outline'
					className={cn(
						'w-[32px] h-[32px]',
						isFocused && 'bg-primary hover:bg-primary focus:bg-primary'
					)}
					type='submit'
				>
					<Search
						className={cn(
							'text-primary min-w-[18px] min-h-[18px]',
							isFocused && 'text-white'
						)}
					/>
				</Button>
			</div>
		</form>
	);
};

export default HeaderSearch;
