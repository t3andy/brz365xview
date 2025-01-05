import { Box } from '@mui/material';
import InvoiceUpload from '../components/invoice/InvoiceUpload';

export default function Upload() {
  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '800px',  // Maximale Breite
      mx: 0,              // Kein horizontaler Margin
      px: 0               // Kein horizontales Padding
    }}>
      <h1>Rechnung hochladen</h1>
      <InvoiceUpload />
    </Box>
  );
} 