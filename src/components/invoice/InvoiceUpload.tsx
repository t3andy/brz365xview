import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  LinearProgress,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslation } from 'react-i18next';

export default function InvoiceUpload() {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    // TODO: Implement actual file upload logic
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here we'll later add the actual upload logic
      console.log('Files to upload:', files);
      
      setSuccess(true);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t('upload.title')}
      </Typography>
      
      <Paper 
        elevation={3}
        sx={{
          p: 3,
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          border: '2px dashed #ccc',
          cursor: 'pointer'
        }}
      >
        <input
          type="file"
          accept=".xml,.pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="invoice-upload-input"
          multiple
        />
        <label htmlFor="invoice-upload-input">
          <Button
            component="span"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={isUploading}
            sx={{ mb: 2 }}
          >
            {t('upload.selectFiles')}
          </Button>
        </label>

        <Typography variant="body2" color="textSecondary">
          {t('upload.dragDropHint')}
        </Typography>
        
        {isUploading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {t('upload.uploadError')}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
            {t('upload.uploadSuccess')}
          </Alert>
        )}
      </Paper>
    </Box>
  );
} 