import { Box } from '@mui/material';
import InvoiceUpload from '../components/invoice/InvoiceUpload';

export default function Upload() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <InvoiceUpload />
    </Box>
  );
} 