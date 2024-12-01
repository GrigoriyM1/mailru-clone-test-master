export const isStringLink = (str: string) => {
	const urlRegex = /^(https?:\/\/[^\s]+)/;
	return urlRegex.test(str);
};
