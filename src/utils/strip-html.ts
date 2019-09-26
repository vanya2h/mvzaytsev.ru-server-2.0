export const stripHtml = (str: string): string => str.replace(/(<([^>]+)>)/gi, '');
