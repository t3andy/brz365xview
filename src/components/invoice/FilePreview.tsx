import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CodeIcon from '@mui/icons-material/Code';
import PDFPreview from './PDFPreview';
import XMLPreview from './XMLPreview';

interface FilePreviewProps {
  file: File;
  onDelete: () => void;
  validationType?: 'xrechnung' | 'zugferd';
}

export default function FilePreview({ file, onDelete, validationType }: FilePreviewProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const toggleExpand = async () => {
    if (!expanded && !preview) {
      if (file.type === 'application/xml' || file.name.endsWith('.xml')) {
        const text = await file.text();
        setPreview(text);
      } else if (file.type === 'application/pdf') {
        // For PDFs, we'll just show file info for now
        setPreview('PDF Preview not available');
      }
    }
    setExpanded(!expanded);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper sx={{ p: 2, mb: 2, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {file.type === 'application/pdf' || file.name.endsWith('.pdf') ? (
          <PictureAsPdfIcon color="primary" sx={{ mr: 2 }} />
        ) : (
          <CodeIcon color="primary" sx={{ mr: 2 }} />
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{file.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {formatFileSize(file.size)} • {validationType || t('upload.typeUnknown')}
          </Typography>
        </Box>
        <IconButton onClick={toggleExpand} size="small" sx={{ mr: 1 }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <IconButton onClick={onDelete} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: 'grey.100', 
          borderRadius: 1,
          maxHeight: '500px',
          overflow: 'auto'
        }}>
          {file.type === 'application/xml' || file.name.endsWith('.xml') ? (
            <XMLPreview file={file} />
          ) : (
            <PDFPreview file={file} />
          )}
        </Box>
      </Collapse>
    </Paper>
  );
} 