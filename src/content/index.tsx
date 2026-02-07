import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { CaptureEngine } from './CaptureEngine';
import { LiquidTooltip } from '../components/LiquidTooltip';

const App = () => {
  const [data, setData] = useState({ word: '', rect: null as DOMRect | null, visible: false });
  const [translation, setTranslation] = useState({ text: '', examples: [] as string[] });

  useEffect(() => {
    new CaptureEngine((word, rect) => {
      setData({ word, rect, visible: true });
      
      chrome.runtime.sendMessage({ type: 'TRANSLATE', word }, (response) => {
        if (response) {
          setTranslation({ text: response.translation, examples: response.examples });
        }
      });
    });

    const hide = () => setData(prev => ({ ...prev, visible: false }));
    document.addEventListener('mousedown', hide);
    return () => document.removeEventListener('mousedown', hide);
  }, []);

  return (
    <LiquidTooltip
      word={data.word}
      rect={data.rect}
      visible={data.visible}
      translation={translation.text}
      examples={translation.examples}
    />
  );
};

const root = document.createElement('div');
root.id = 'mavis-learning-root';
document.body.appendChild(root);
ReactDOM.createRoot(root).render(<App />);
