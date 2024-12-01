import { axiosWithAuth } from '@/api';
import Stripe from 'stripe';

class StripeService {
	private BASE_URL = '/stripe';

	async subscription(userId: string, amount: number, redirectUrl: string) {
		const response = await axiosWithAuth.post<
			Stripe.Response<Stripe.Checkout.Session>
		>(`${this.BASE_URL}/subscription`, {
			userId,
			amount, // dollars
			redirectUrl,
		});
		return response.data;
	}
}

export const stripeService = new StripeService();
