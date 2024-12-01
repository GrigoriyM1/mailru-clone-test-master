import { absoluteUrl } from '@/lib'
import { stripeService } from '@/services';
import { useUserStore } from '@/store'
import { Crown } from 'lucide-react';
import { toast } from 'sonner';

const VipStatusBtn = () => {
	const { user } = useUserStore();

	const isVip = user?.isVip;

	const onUpgrade = async () => {
		toast.loading('Redirecting to checkout...');
		const res = await stripeService.subscription(user?.id!, 1, absoluteUrl(`/profile/${user?.id}`))
		window.location.href = res?.url!;
	};

	if (isVip) return null;

	return (
		<div
			className='cursor-pointer px-6 py-2 flex gap-2 hover:bg-gray-300 transition rounded-sm'
			onClick={onUpgrade}
		>
			<Crown />
			Получить VIP-статус
		</div>
	);
};

export default VipStatusBtn;
