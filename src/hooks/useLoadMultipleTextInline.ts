import { useEffect, useState } from 'react';

export default function useLoadMultipleTextInline(texts: string[], delay: number = 2000) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(texts[0]);

  useEffect(() => {
    if (index === texts.length - 1) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, delay);

    return () => clearInterval(interval);
  }, [texts.length, delay]);

  useEffect(() => {
    setText(texts[index]);
  }, [index, texts]);

  return text;
}
