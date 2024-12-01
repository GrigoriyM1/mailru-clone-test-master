import { axiosWithAuth } from '@/api';
import {
	INotificationRequest,
	INotificationResponse,
} from '@/types';

class NotificationService {
	private BASE_URL = '/notification';

	async getAll() {
		const response = await axiosWithAuth.get<INotificationResponse[]>(
			this.BASE_URL
		);
		return response.data;
	}

	async create(data: INotificationRequest) {
		const response = await axiosWithAuth.post<INotificationResponse[]>(
			this.BASE_URL,
			{
				...data,
				avatars: data.avatars.slice(0, 3),
			}
		);
		return response.data;
	}

	async readAll() {
		const response = await axiosWithAuth.post<INotificationResponse[]>(
			this.BASE_URL + '/read-all'
		);
		return response.data;
	}
}

export const notificationService = new NotificationService();
