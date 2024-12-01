import { axiosClassic, axiosWithAuth } from '@/api';
import {
	IEditProfileForm,
	IEditProfilePageData,
	IEditProfilePageForm,
	IMinUserWithPoints,
	IUser,
} from '@/types';

class UserService {
	private BASE_URL = '/user';

	async getByEmail(email: string) {
		const response = await axiosClassic.post<boolean>(
			this.BASE_URL + '/get-by-email',
			{ email }
		);
		return response.data;
	}

	async getById(id: string) {
		const response = await axiosWithAuth.get<IUser>(this.BASE_URL + '/get-by-id/' + id);
		return response.data;
	}

	async editProfile(data: IEditProfileForm) {
		const response = await axiosWithAuth.patch<IUser>(
			this.BASE_URL + '/edit-profile',
			data
		);
		return response.data;
	}

	async editProfilePage(data: IEditProfilePageData) {
		const response = await axiosWithAuth.patch<IUser>(
			this.BASE_URL + '/edit-profile-page',
			data
		);
		return response.data;
	}

	async editProfileAvatar(formData: FormData) {
		const response = await axiosWithAuth.patch<boolean>(
			this.BASE_URL + '/edit-profile-avatar',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return response.data;
	}

	async getLeaders(type: 'activity' | 'answersLength') {
		const response = await axiosWithAuth.get<IMinUserWithPoints[]>(
			this.BASE_URL + '/leaders',
			{
				params: {
					type,
				},
			}
		);
		return response.data;
	}
}

export const userService = new UserService();
