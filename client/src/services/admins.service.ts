import { axiosWithAuth } from '@/api';
import { IReport } from '@/types';

class AdminsService {
  private BASE_URL = '/report'

	async report(data: IReport) {
		const response = await axiosWithAuth.post<boolean>(
			this.BASE_URL,
			data
		);
		return response.data;
	}
}

export const adminsService = new AdminsService();
