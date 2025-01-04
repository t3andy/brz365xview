import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';
import '../../utils/pdfjs-worker';

interface PDFPreviewProps {
  file: File;
  width?: number;
}

export default function PDFPreview({ file, width = 600 }: PDFPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;
    let pdf: PDFDocumentProxy | null = null;

    const loadPDF = async () => {
      if (!canvasRef.current) {
        console.log('Waiting for canvas...');
        setTimeout(() => setRenderTrigger(prev => prev + 1), 100);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const arrayBuffer = await file.arrayBuffer();
        console.log('PDF ArrayBuffer loaded, size:', arrayBuffer.byteLength);
        
        pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        console.log('PDF loaded, pages:', pdf.numPages);
        
        if (!mounted) return;

        const page = await pdf.getPage(1);
        console.log('Page loaded');
        
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error('Canvas not available');
        }

        const viewport = page.getViewport({ scale: 1 });
        const scale = width / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        console.log('Canvas size set:', canvas.width, 'x', canvas.height);

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Canvas context not available');
        }

        await page.render({
          canvasContext: context,
          viewport: scaledViewport
        }).promise;

        console.log('PDF rendered successfully');
        if (mounted) setLoading(false);

      } catch (err) {
        console.error('PDF loading error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error loading PDF preview');
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      mounted = false;
      if (pdf) {
        pdf.destroy();
      }
    };
  }, [file, width, renderTrigger]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      minHeight: 200
    }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Box sx={{ color: 'error.main', p: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <canvas 
        ref={canvasRef} 
        style={{ 
          display: loading ? 'none' : 'block',
          maxWidth: '100%', 
          height: 'auto',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }} 
      />
    </Box>
  );
} 