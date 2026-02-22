import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export async function exportToDocx(title: string, content: string) {
    // Simple markdown-to-docx parser (H1, H2, and Bullet points)
    const lines = content.split('\n');
    const children = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('# ')) {
            children.push(new Paragraph({
                text: trimmed.replace('# ', ''),
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 200 }
            }));
        } else if (trimmed.startsWith('## ')) {
            children.push(new Paragraph({
                text: trimmed.replace('## ', ''),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 120 }
            }));
        } else if (trimmed.startsWith('- ')) {
            children.push(new Paragraph({
                text: trimmed.replace('- ', ''),
                bullet: { level: 0 },
                spacing: { after: 100 }
            }));
        } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: trimmed.replace(/\*\*/g, ''),
                        bold: true,
                    }),
                ],
                spacing: { after: 120 }
            }));
        } else {
            children.push(new Paragraph({
                text: trimmed,
                spacing: { after: 120 }
            }));
        }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title.replace(/\s+/g, '_')}_PRD.docx`);
}
