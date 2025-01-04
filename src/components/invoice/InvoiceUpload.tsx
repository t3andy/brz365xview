import { useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AlertTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { uploadInvoice } from '../../services/api';
import { validateInvoiceFile, ValidationResult } from '../../services/fileValidator';
import FilePreview from './FilePreview';

// Allowed file types
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/xml': ['.xml'],
  'text/xml': ['.xml']
};

interface FileWithPreview extends File {
  preview?: string;
}

export default function InvoiceUpload() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<{[key: string]: ValidationResult}>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newValidationResults: {[key: string]: ValidationResult} = {};
    const validFiles: File[] = [];

    for (const file of acceptedFiles) {
      const validation = await validateInvoiceFile(file);
      newValidationResults[file.name] = validation;
      if (validation.isValid) {
        validFiles.push(file);
      }
    }

    setValidationResults(prev => ({ ...prev, ...newValidationResults }));
    if (validFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/xml': ['.xml'],
      'application/pdf': ['.pdf']
    }
  });

  const handleFileUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    try {
      await uploadInvoice(files, (progress) => {
        setUploadProgress(progress);
      });
      
      setSuccess(true);
      setFiles([]); // Clear files after successful upload
    } catch (err: any) {
      // Improved error handling
      let errorMessage = t('upload.uploadError');
      
      if (err.message === 'Network Error' || err.message.includes('Server nicht erreichbar')) {
        errorMessage = t('upload.serverNotReachable');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = (index: number) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      const deletedFile = newFiles[index];
      if (deletedFile) {
        const newValidationResults = { ...validationResults };
        delete newValidationResults[deletedFile.name];
        setValidationResults(newValidationResults);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) {
      return <PictureAsPdfIcon color="error" />;
    }
    if (fileName.endsWith('.xml')) {
      return <DescriptionIcon color="primary" />;
    }
    return <InsertDriveFileIcon />;
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
          backgroundColor: '#f5f5f5',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : '#ccc',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease-in-out'
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        
        <Box sx={{ textAlign: 'center' }}>
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            {isDragActive 
              ? t('upload.dropFilesHere')
              : t('upload.dragDropHint')}
          </Typography>
          <Button
            variant="contained"
            component="span"
            sx={{ mt: 2 }}
          >
            {t('upload.selectFiles')}
          </Button>
        </Box>
      </Paper>

      {/* File List */}
      {files.length > 0 && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <List>
            {files.map((file, index) => (
              <ListItem
                key={`${file.name}-${index}`}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  {getFileIcon(file.name)}
                </ListItemIcon>
                <ListItemText 
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB`}
                />
              </ListItem>
            ))}
          </List>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleFileUpload}
            disabled={isUploading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isUploading ? t('common.loading') : t('upload.uploadFiles')}
          </Button>
        </Paper>
      )}

      {isUploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress} 
          />
          <Typography variant="body2" color="text.secondary" align="center">
            {uploadProgress}%
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {t('upload.uploadSuccess')}
        </Alert>
      )}

      {/* File Previews */}
      <Box sx={{ mt: 3 }}>
        {files.map((file, index) => (
          <FilePreview
            key={`${file.name}-${index}`}
            file={file}
            onDelete={() => handleDelete(index)}
            validationType={validationResults[file.name]?.type}
          />
        ))}
      </Box>
    </Box>
  );
} 