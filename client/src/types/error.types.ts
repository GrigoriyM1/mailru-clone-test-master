export interface IError extends Error {
	response?: {
		data?: {
			type?: string;
			errors?: {
				[key: string]: string;
			};
			message?: string
		};
	};
}
