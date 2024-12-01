export interface INotificationRequest {
	title: string;
	text: string;
	subtitle?: string;
	url: string;
	avatars: string[];
	userId: string;
	
	type?: 'DEFAULT' | 'POINTS';
	points?: number;
}

export interface INotificationResponse {
	id: string;
	createdAt: string;
	updatedAt: string;
	title: string;
	text: string;
	subtitle?: string;
	url: string;
	avatars: string[];

	type?: 'DEFAULT' | 'POINTS';
	points?: number;

	isRead: boolean;
	userId: string;
}
