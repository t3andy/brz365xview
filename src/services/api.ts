import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadInvoice = async (
  files: File[], 
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await api.post('/api/invoices/upload', formData, {
      timeout: 10000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(progress);
        }
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Upload-Endpunkt nicht gefunden. Bitte überprüfen Sie die Server-Konfiguration.');
    }
    throw error;
  }
};

export default api; 