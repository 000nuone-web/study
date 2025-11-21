const fileInputsContainer = document.getElementById('fileInputs');
const loading = document.getElementById('loading');

// ①〜⑳のラベルをつけて20個のファイル選択欄を作成
const labels = [
  '①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩',
  '⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳'
];

for (let i = 0; i < 20; i++) {
  const div = document.createElement('div');
  div.className = 'file-slot';

  const label = document.createElement('label');
  label.textContent = `${labels[i]} PDFファイル`;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/pdf';
  input.className = 'pdfInput';

  const fileNameDisplay = document.createElement('div');
  fileNameDisplay.className = 'file-name';
  fileNameDisplay.textContent = '未選択';

  input.addEventListener('change', () => {
    fileNameDisplay.textContent = input.files.length > 0 ? input.files[0].name : '未選択';
  });

  div.appendChild(label);
  div.appendChild(input);
  div.appendChild(fileNameDisplay);
  fileInputsContainer.appendChild(div);
}

// 結合処理
document.getElementById('mergeBtn').addEventListener('click', async () => {
  const inputs = document.querySelectorAll('.pdfInput');
  const files = [];

  inputs.forEach(input => {
    if (input.files.length > 0) {
      files.push(input.files[0]);
    }
  });

  if (files.length < 2) {
    alert('2つ以上のPDFファイルを選択してください');
    return;
  }

  loading.style.display = 'block';

  try {
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (let file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('PDFの結合中にエラーが発生しました：' + error.message);
    console.error(error);
  } finally {
    loading.style.display = 'none';
  }
});
