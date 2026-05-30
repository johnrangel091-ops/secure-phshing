import { OFFICIAL_LOGO_SVG } from './officialLogoSvg';

let cachedLogoDataUrl: string | null = null;

/** Convierte el SVG oficial a PNG Base64 para incrustar en jsPDF. */
export function loadLogoPngDataUrl(size = 128): Promise<string> {
  if (cachedLogoDataUrl) {
    return Promise.resolve(cachedLogoDataUrl);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([OFFICIAL_LOGO_SVG], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas para el logo.'));
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        cachedLogoDataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(objectUrl);
        resolve(cachedLogoDataUrl);
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo cargar el logo SVG para el PDF.'));
    };

    img.src = objectUrl;
  });
}
