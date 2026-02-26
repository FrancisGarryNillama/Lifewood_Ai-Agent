import { useState } from 'react';
import { expenseApi } from '../../../api';
import { dataURLtoFile } from '../../../utils';

export function useDemoOcr() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const processImages = async (images) => {
    if (!images || images.length === 0) {
      setError('No images to process');
      return null;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Convert images to File objects if needed
      const processedImages = images.map((img) => {
        if (img.file instanceof File) {
          return img;
        } else if (typeof img.src === 'string' && img.src.startsWith('data:')) {
          const file = dataURLtoFile(img.src, img.name || `image-${Date.now()}.jpg`);
          return { ...img, file };
        }
        return img;
      });

      const data = await expenseApi.uploadDemoOcr(processedImages);

      // Map results back to images
      const mapped = images.map((img, index) => {
        const matchByName = data.results?.find(
          (r) => r.file_name === (img.name || img.file?.name)
        );
        const fallback = data.results?.[index];
        const result = matchByName || fallback || {
          file_name: img.name || '',
          student_name: null,
          school_name: null,
          entries: [],
        };
        return { ...img, result };
      });

      setResults(mapped);
      return mapped;
    } catch (err) {
      console.error('Demo OCR Error:', err);
      setError(err.message || 'Failed to process images');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResults([]);
  };

  return { processImages, loading, error, results, reset };
}

