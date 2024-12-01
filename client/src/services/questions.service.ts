import { axiosWithAuth } from '@/api';
import {
	ICategories,
	IQuestion,
	IQuestionForm,
	IQuestionsWithLength,
	IUpdatedLikes,
	IQuestionsSearch,
} from '@/types';

class QuestionsService {
	private BASE_URL = '/question'

	async getAll(
		category?: string | undefined,
		skip?: number,
		take?: number
	) {
		const response = await axiosWithAuth.get<IQuestion[]>(this.BASE_URL, {
			params: {
				skip,
				take,
				category,
			},
		});
		return response.data;
	}

	async getOne(id: string) {
		const response = await axiosWithAuth.get<IQuestion | string>(
			`${this.BASE_URL}/get-one/${id}`
		);
		return response.data;
	}

	async create(data: IQuestionForm) {
		const response = await axiosWithAuth.post<IQuestion>(this.BASE_URL, data);
		return response.data;
	}

	async update(id: string, data: Partial<IQuestionForm>) {
		const response = await axiosWithAuth.put<IQuestion>(
			`${this.BASE_URL}/${id}`,
			data
		);
		return response.data;
	}

	async getCategories() {
		const response = await axiosWithAuth.get<ICategories>(
			`${this.BASE_URL}/categories`
		);
		return response.data;
	}

	async like(id: string) {
		const response = await axiosWithAuth.patch<IUpdatedLikes>(
			`${this.BASE_URL}/like/${id}`
		);
		return response.data;
	}

	async addAdditional(id: string, additional: string) {
		const response = await axiosWithAuth.patch<IQuestion>(
			`${this.BASE_URL}/add-additional/${id}`,
			{ additional }
		);
		return response.data;
	}

	async getLeaders({
		category,
		take,
		skip,
	}: {
		category?: string;
		take?: number;
		skip?: number;
	}) {
		const response = await axiosWithAuth.get<IQuestion[]>(`${this.BASE_URL}/leaders`, {
			params: {
				take,
				skip,
				category,
			},
		});
		return response.data;
	}

	async getFromUser(
		userId: string,
		category: string,
		skip?: number,
		take?: number // тут
	) {
		const response = await axiosWithAuth.get<IQuestionsWithLength>(
			`${this.BASE_URL}/user/${userId}/${category || 'all'}`,
			{
				params: {
					take,
					skip,
				},
			}
		);
		return response.data;
	}

	async search(
		searchText: string,
		category: string,
		subcategory: string,
		time: string,
		type: string,
		order: string,
		skip?: number,
		take?: number
	) {
		const response = await axiosWithAuth.get<IQuestionsSearch>(
			`${this.BASE_URL}/search/${searchText}`,
			{
				params: {
					take,
					skip,
					category: category === 'all' ? undefined : category,
					subcategory,
					time,
					type,
					order,
				},
			}
		);
		return response.data;
	}

	async delete(id: string) {
		const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`);
		return response.data;
	}

	async makeLeader(id: string) {
		const response = await axiosWithAuth.post(`${this.BASE_URL}/make-leader/${id}`);
		return response.data;
	}
}

export const questionsService = new QuestionsService();
