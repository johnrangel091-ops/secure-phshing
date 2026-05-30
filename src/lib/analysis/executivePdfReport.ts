import { jsPDF } from 'jspdf';
import { loadLogoPngDataUrl } from '../brand/logoForPdf';
import { analyzeUrlForPhishing } from './phishingAnalyzer';
import { deriveUrlContext } from './urlContext';
import { getDynamicAccessStatus } from './accessStatus';
import { getSecurityRecommendations } from './securityRecommendations';

export interface PdfReportInput {
  id: number | string;
  url: string;
  date: string;
  estado: 'Pendiente' | 'Seguro' | 'Sospechoso';
  risk: string;
  score: number;
  bloqueado?: boolean;
}

const PAGE_WIDTH = 210;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function ensureSpace(doc: jsPDF, yPos: number, needed: number): number {
  if (yPos + needed > 275) {
    doc.addPage();
    drawPageFooter(doc, doc.getNumberOfPages());
    return 28;
  }
  return yPos;
}

function drawPageFooter(doc: jsPDF, pageNum: number) {
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('PhishingSecureJD — Documento confidencial de seguridad', MARGIN, 287);
  doc.text(`Pagina ${pageNum}`, PAGE_WIDTH - MARGIN, 287, { align: 'right' });
}

function drawSectionTitle(doc: jsPDF, title: string, yPos: number): number {
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(MARGIN, yPos - 5, CONTENT_WIDTH, 10, 1, 1, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), MARGIN + 4, yPos + 2);
  return yPos + 14;
}

function drawKeyValue(
  doc: jsPDF,
  label: string,
  value: string,
  yPos: number,
  valueColor: [number, number, number] = [30, 41, 59],
): number {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text(label, MARGIN, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...valueColor);
  const lines = doc.splitTextToSize(value, CONTENT_WIDTH - 52);
  doc.text(lines, MARGIN + 48, yPos);

  return yPos + Math.max(7, lines.length * 5 + 2);
}

function drawPdfBrandHeader(doc: jsPDF, logoDataUrl: string | null): void {
  doc.setFillColor(8, 47, 73);
  doc.rect(0, 0, PAGE_WIDTH, 48, 'F');
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 48, PAGE_WIDTH, 2, 'F');

  const logoSize = 14;
  const textStartX = logoDataUrl ? MARGIN + logoSize + 6 : MARGIN;

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', MARGIN, 10, logoSize, logoSize);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PhishingSecureJD', textStartX, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.text('Reporte Ejecutivo de Analisis de Seguridad', textStartX, 32);
}

/** Genera un reporte PDF ejecutivo corporativo con analisis completo. */
export async function generateExecutivePdfReport(item: PdfReportInput): Promise<void> {
  const analysis = analyzeUrlForPhishing(item.url);
  const context = deriveUrlContext(item.url, analysis);
  const access = getDynamicAccessStatus({
    risk: item.risk || analysis.risk,
    estado: item.estado,
    bloqueado: item.bloqueado,
  });
  const recommendations = getSecurityRecommendations(analysis);

  let logoDataUrl: string | null = null;
  try {
    logoDataUrl = await loadLogoPngDataUrl(128);
  } catch {
    logoDataUrl = null;
  }

  const doc = new jsPDF();
  const reportId = `PSJD-${String(item.id).padStart(6, '0')}`;
  const generatedAt = new Date().toLocaleString('es-ES');

  drawPdfBrandHeader(doc, logoDataUrl);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`ID: ${reportId}`, PAGE_WIDTH - MARGIN, 18, { align: 'right' });
  doc.text(`Generado: ${generatedAt}`, PAGE_WIDTH - MARGIN, 26, { align: 'right' });
  doc.text(`Fecha analisis: ${item.date}`, PAGE_WIDTH - MARGIN, 34, { align: 'right' });

  let yPos = 58;

  // --- Resumen ejecutivo ---
  yPos = drawSectionTitle(doc, 'Resumen Ejecutivo', yPos);

  const riskColor: [number, number, number] =
    analysis.color === 'emerald'
      ? [16, 185, 129]
      : analysis.color === 'yellow'
        ? [234, 179, 8]
        : [239, 68, 68];

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(MARGIN, yPos - 2, CONTENT_WIDTH, 28, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Nivel de riesgo:', MARGIN + 4, yPos + 6);
  doc.setTextColor(...riskColor);
  doc.text(`${analysis.risk} (${analysis.score}% seguridad)`, MARGIN + 42, yPos + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Estado:', MARGIN + 4, yPos + 14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(item.estado, MARGIN + 42, yPos + 14);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Acceso:', MARGIN + 4, yPos + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...(access.permitted ? ([16, 185, 129] as const) : ([239, 68, 68] as const)));
  doc.text(access.text, MARGIN + 42, yPos + 22);

  yPos += 36;

  // --- Detalles del analisis ---
  yPos = ensureSpace(doc, yPos, 60);
  yPos = drawSectionTitle(doc, 'Detalles del Analisis', yPos);

  yPos = drawKeyValue(doc, 'URL escaneada:', item.url, yPos);
  yPos = drawKeyValue(doc, 'Hostname:', context.hostname, yPos);
  yPos = drawKeyValue(doc, 'Direccion IP:', context.ipAddress, yPos);
  yPos = drawKeyValue(doc, 'Geolocalizacion:', context.country, yPos);
  yPos = drawKeyValue(doc, 'ISP / Proveedor:', context.isp, yPos);
  yPos = drawKeyValue(
    doc,
    'Certificado SSL:',
    `${context.sslStatus} — Emisor: ${context.sslIssuer}`,
    yPos,
  );
  yPos = drawKeyValue(
    doc,
    'Protocolo / Firma:',
    `${context.tlsVersion} · ${context.signatureAlgorithm} · Expira en ${context.expiresInDays} dias`,
    yPos,
  );

  yPos += 6;

  // --- Resultados heuristicos ---
  yPos = ensureSpace(doc, yPos, 40);
  yPos = drawSectionTitle(doc, 'Resultados Heuristicos', yPos);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Factores de riesgo detectados por el motor de analisis:',
    MARGIN,
    yPos,
  );
  yPos += 8;

  if (analysis.reasons.length === 0) {
    doc.setTextColor(16, 185, 129);
    doc.text('• No se detectaron patrones de phishing significativos.', MARGIN + 2, yPos);
    yPos += 7;
  } else {
    analysis.reasons.forEach((reason) => {
      yPos = ensureSpace(doc, yPos, 12);
      doc.setTextColor(30, 41, 59);
      const bulletLines = doc.splitTextToSize(`• ${reason}`, CONTENT_WIDTH - 4);
      doc.text(bulletLines, MARGIN + 2, yPos);
      yPos += bulletLines.length * 5 + 3;
    });
  }

  yPos += 4;

  // --- Recomendaciones ---
  yPos = ensureSpace(doc, yPos, 30);
  yPos = drawSectionTitle(doc, 'Recomendaciones de Seguridad', yPos);

  recommendations.forEach((rec, index) => {
    yPos = ensureSpace(doc, yPos, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, CONTENT_WIDTH - 4);
    doc.text(lines, MARGIN + 2, yPos);
    yPos += lines.length * 5 + 4;
  });

  yPos = ensureSpace(doc, yPos, 20);
  doc.setDrawColor(203, 213, 225);
  doc.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
  yPos += 8;

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Este reporte fue generado automaticamente por PhishingSecureJD. Los resultados heurísticos no sustituyen una auditoria de seguridad profesional.',
    MARGIN,
    yPos,
    { maxWidth: CONTENT_WIDTH },
  );

  drawPageFooter(doc, 1);

  doc.save(`PhishingSecureJD_Reporte_${item.id}.pdf`);
}
