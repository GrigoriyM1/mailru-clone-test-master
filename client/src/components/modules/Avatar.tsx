import {
	Avatar as AvatarUi,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui';
import { IMinUser } from '@/types';
import Link from 'next/link';
import cn from 'clsx';
import { isStringLink } from '@/lib';

interface IAvatarProps extends React.ComponentProps<typeof AvatarUi> {
	user: IMinUser;
	isLink?: boolean;
	avatarFallbackProps?: React.ComponentProps<typeof AvatarFallback>;
}

export const Avatar: React.FC<IAvatarProps> = ({
	user,
	isLink = true,
	avatarFallbackProps,
	className,
	...props
}) => {
	return isLink ? (
		<Link href={`/profile/${user?.id}`}>
			<AvatarUi
				className={cn(className, user.isVip && 'avatar-border-animated')}
				{...props}
			>
				{typeof user?.avatar === 'string' && isStringLink(user?.avatar) && (
					<AvatarImage src={user?.avatar} alt={user?.name} />
				)}
				<AvatarFallback {...avatarFallbackProps}>
					{user?.name?.toUpperCase()[0]}
				</AvatarFallback>
			</AvatarUi>
		</Link>
	) : (
		<AvatarUi
			className={cn(className, user.isVip && 'avatar-border-animated')}
			{...props}
		>
			{typeof user?.avatar === 'string' && isStringLink(user?.avatar) && (
				<AvatarImage src={user?.avatar} alt={user?.name} />
			)}
			<AvatarFallback {...avatarFallbackProps}>
				{user?.name?.toUpperCase()[0]}
			</AvatarFallback>
		</AvatarUi>
	);
};
