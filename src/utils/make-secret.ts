export const makeSecret = (count: number = 6): string => {
	let text = '';
	const possible = '0123456789';
	for (let i = 0; i < count; i += 1) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};
