export interface ValidationResult {
  isValid: boolean;
  message: string;
  type?: 'xrechnung' | 'zugferd';
}

export const validateInvoiceFile = async (file: File): Promise<ValidationResult> => {
  // Check file size (max 10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      message: 'File size exceeds 10MB limit'
    };
  }

  // Check file type
  if (file.type === 'application/xml' || file.name.endsWith('.xml')) {
    return await validateXMLFile(file);
  } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return await validatePDFFile(file);
  }

  return {
    isValid: false,
    message: 'Invalid file type. Only XML (XRechnung) and PDF (ZUGFeRD) files are allowed'
  };
};

const validateXMLFile = async (file: File): Promise<ValidationResult> => {
  try {
    const content = await file.text();
    
    // Check for XRechnung indicators
    if (content.includes('urn:cen.eu:en16931:2017') || 
        content.includes('urn:xoev-de:kosit:standard:xrechnung')) {
      return {
        isValid: true,
        message: 'Valid XRechnung file',
        type: 'xrechnung'
      };
    }
    
    return {
      isValid: false,
      message: 'XML file is not a valid XRechnung document'
    };
  } catch (error) {
    return {
      isValid: false,
      message: 'Error reading XML file'
    };
  }
};

const validatePDFFile = async (file: File): Promise<ValidationResult> => {
  try {
    // For PDF files, we'll check the first few bytes for PDF magic number
    const buffer = await file.slice(0, 5).arrayBuffer();
    const header = new Uint8Array(buffer);
    const isPDF = header[0] === 0x25 && // %
                  header[1] === 0x50 && // P
                  header[2] === 0x44 && // D
                  header[3] === 0x46 && // F
                  header[4] === 0x2D;   // -
    
    if (!isPDF) {
      return {
        isValid: false,
        message: 'Not a valid PDF file'
      };
    }

    // Note: Full ZUGFeRD validation would require parsing PDF metadata
    // This is a simplified check
    return {
      isValid: true,
      message: 'PDF file accepted (ZUGFeRD validation will be performed on server)',
      type: 'zugferd'
    };
  } catch (error) {
    return {
      isValid: false,
      message: 'Error reading PDF file'
    };
  }
}; 