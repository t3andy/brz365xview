import { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableRow, Paper } from '@mui/material';

interface XMLPreviewProps {
  file: File;
}

interface InvoiceData {
  documentNumber?: string;
  issueDate?: string;
  buyerReference?: string;
  currency?: string;
  totalAmount?: string;
  taxAmount?: string;
  [key: string]: string | undefined;
}

export default function XMLPreview({ file }: XMLPreviewProps) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseXML = async () => {
      try {
        let text = await file.text();
        text = text.replace(/^\s+/, '').replace(/^\uFEFF/, '');

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');

        // Prüfe auf Parse-Fehler
        const parseError = xmlDoc.getElementsByTagName('parsererror')[0];
        if (parseError) {
          throw new Error(parseError.textContent || 'XML parsing failed');
        }

        // Extrahiere relevante Daten mit Namespace-Berücksichtigung
        const data: InvoiceData = {
          documentNumber: getXMLValueWithNamespace(xmlDoc, ['ID', 'rsm:ID']),
          issueDate: getXMLValueWithNamespace(xmlDoc, ['IssueDate', 'rsm:IssueDate']),
          buyerReference: getXMLValueWithNamespace(xmlDoc, ['BuyerReference', 'rsm:BuyerReference']),
          currency: getXMLValueWithNamespace(xmlDoc, ['InvoiceCurrencyCode', 'rsm:InvoiceCurrencyCode']),
          totalAmount: getXMLValueWithNamespace(xmlDoc, ['LineTotalAmount', 'rsm:LineTotalAmount']),
          taxAmount: getXMLValueWithNamespace(xmlDoc, ['TaxTotalAmount', 'rsm:TaxTotalAmount']),
        };

        console.log('Parsed invoice data:', data); // Debug-Ausgabe
        setInvoiceData(data);
        setError(null);
      } catch (error) {
        console.error('Error parsing XML:', error);
        setError(error instanceof Error ? error.message : 'Error parsing XML');
      }
    };

    parseXML();
  }, [file]);

  // Hilfsfunktion zum Extrahieren von XML-Werten mit Namespace-Unterstützung
  const getXMLValueWithNamespace = (doc: Document, possibleTags: string[]): string => {
    for (const tag of possibleTags) {
      const elements = doc.getElementsByTagName(tag);
      if (elements.length > 0 && elements[0].textContent) {
        return elements[0].textContent;
      }
    }
    return '';
  };

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!invoiceData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Nur Einträge mit Werten anzeigen
  const validEntries = Object.entries(invoiceData).filter(([_, value]) => value);

  if (validEntries.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Keine Rechnungsdaten gefunden</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Table>
        <TableBody>
          {validEntries.map(([key, value]) => (
            <TableRow key={key}>
              <TableCell 
                component="th" 
                scope="row"
                sx={{ 
                  fontWeight: 'bold',
                  width: '40%',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)'
                }}
              >
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </TableCell>
              <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                {value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
} 