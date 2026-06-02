/** Web 전용: HTML → PDF (expo-print는 window.print만 호출하므로 html2pdf 사용) */

const PDF_FILENAME = 'tracktory_recommendation.pdf';

function mountHtmlForPdf(html: string): HTMLDivElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const container = document.createElement('div');
  container.setAttribute('id', 'tracktory-pdf-export-root');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = '210mm';
  container.style.background = '#fff';
  container.style.color = '#1a1a1a';

  const styleEl = doc.querySelector('style');
  if (styleEl?.textContent) {
    const inlineStyle = document.createElement('style');
    inlineStyle.textContent = styleEl.textContent;
    container.appendChild(inlineStyle);
  }

  Array.from(doc.body.childNodes).forEach((node) => {
    container.appendChild(node.cloneNode(true));
  });

  document.body.appendChild(container);
  return container;
}

export async function exportPdfOnWeb(html: string): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default;
  const container = mountHtmlForPdf(html);

  try {
    await html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: PDF_FILENAME,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], before: '.report-section-newpage' },
      })
      .from(container)
      .save();
  } finally {
    container.remove();
  }
}
