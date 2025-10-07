let recognition;
let isListening = false;

function detectLanguage(text) {
  const jaPattern = /[ぁ-んァ-ン一-龯]/;
  const enPattern = /[a-zA-Z]/;

  const isJa = jaPattern.test(text);
  const isEn = enPattern.test(text);

  if (isJa && !isEn) return 'ja';
  if (isEn && !isJa) return 'en';

  const jaCount = (text.match(jaPattern) || []).length;
  const enCount = (text.match(enPattern) || []).length;
  return jaCount >= enCount ? 'ja' : 'en';
}

function startRecognition() {
  if (isListening) return;
  isListening = true;

  recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = 'ja-JP'; // 固定言語（必要に応じて切り替え可能）
  recognition.continuous = true;
  recognition.interimResults = true; // 途中結果も取得
  recognition.maxAlternatives = 1;

  recognition.onresult = async (event) => {
    const lastResult = event.results[event.results.length - 1];
    if (!lastResult.isFinal) return; // 最終結果のみ処理

    const rawText = lastResult[0].transcript.trim();
    if (!rawText) return;

    const sourceLang = detectLanguage(rawText);
    const targetLang = sourceLang === 'ja' ? 'en' : 'ja';

    let sourceText = rawText;
    if (sourceLang === 'ja' && !/[。！？]$/.test(sourceText)) {
      sourceText += '。';
    }
    if (sourceLang === 'en' && !/[.!?]$/.test(sourceText)) {
      sourceText += '.';
    }

    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`);
    const data = await response.json();
    const translated = data[0].map(item => item[0]).join('').trim();

    const sourceBox = document.getElementById(sourceLang === 'ja' ? 'output-ja' : 'output-en');
    const targetBox = document.getElementById(sourceLang === 'ja' ? 'output-en' : 'output-ja');

    sourceBox.textContent += sourceText + '\n';
    targetBox.textContent += translated + '\n';

    sourceBox.scrollTop = sourceBox.scrollHeight;
    targetBox.scrollTop = targetBox.scrollHeight;
  };

  recognition.onend = () => {
    if (isListening) {
      recognition.start(); // 無音で停止しても再起動
    }
  };

  recognition.start();
}

function stopRecognition() {
  if (recognition) recognition.stop();
  isListening = false;
}
