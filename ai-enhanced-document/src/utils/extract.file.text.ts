import pdf from 'pdf-parse';

export const extractTextFromDoc = async (data: Buffer, mimetype: string): Promise<string> => {
    if (mimetype === 'application/pdf') {
        const pdfData = await pdf(data);
        return pdfData.text;
    } else if (mimetype === 'text/plain') {
        return data.toString('utf-8');
    }
    throw new Error('Unsupported file type');
};