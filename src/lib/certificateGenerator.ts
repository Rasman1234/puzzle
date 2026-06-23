import { getAvatarById } from '../data/content';
import { loadProgress } from './playerProgress';

export interface CertificateData {
  title: string;
  subtitle: string;
  achievementName: string;
  emoji: string;
}

export function downloadCertificate(data: CertificateData): void {
  const p = loadProgress();
  const avatar = p.avatarId ? getAvatarById(p.avatarId) : null;
  const date = new Date().toLocaleDateString();

  const lines = [
    'Kids Puzzle Adventure Certificate',
    '',
    data.title,
    data.subtitle,
    '',
    `Awarded to: ${avatar?.name ?? 'Puzzle Star'} ${avatar?.emoji ?? '⭐'}`,
    `Achievement: ${data.emoji} ${data.achievementName}`,
    `Stars earned: ${p.totalStars}`,
    `Date: ${date}`,
    '',
    'Great job exploring and learning!',
  ];

  const pdf = buildMinimalPdf(lines);
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `puzzle-certificate-${data.achievementName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapePdf(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildMinimalPdf(lines: string[]): Uint8Array {
  const content = lines
    .map((line, i) => `BT /F1 14 Tf 50 ${750 - i * 28} Td (${escapePdf(line)}) Tj ET`)
    .join('\n');

  const stream = `stream\n${content}\nendstream`;
  const objects = [
    '1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj',
    '2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj',
    '3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj',
    `4 0 obj<< /Length ${stream.length} >>${stream}endobj`,
    '5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj',
  ];

  let body = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(body.length);
    body += obj + '\n';
  }
  const xrefStart = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    body += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  body += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(body);
}

export const CERTIFICATE_TEMPLATES: CertificateData[] = [
  { title: 'Puzzle Explorer', subtitle: 'For completing amazing puzzles!', achievementName: 'Puzzle Explorer', emoji: '🧩' },
  { title: 'Achievement Hunter', subtitle: 'For unlocking awesome badges!', achievementName: 'Achievement Hunter', emoji: '🎖️' },
  { title: 'Sticker Collector', subtitle: 'For filling the sticker book!', achievementName: 'Sticker Collector', emoji: '🏆' },
  { title: 'Weekly Champion', subtitle: 'For finishing weekly challenges!', achievementName: 'Weekly Champion', emoji: '👑' },
];
