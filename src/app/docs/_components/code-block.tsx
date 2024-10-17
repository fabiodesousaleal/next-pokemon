'use client'
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Tema dark, mas existem outros
import { useEffect, useState } from 'react';

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll(); // Destaca o código após o render
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Volta ao normal após 2 segundos
    } catch (err) {
      console.error("Falha ao copiar o código: ", err);
    }
  }; 

  return (
    <div className="relative bg-gray-100 p-4 rounded-md shadow-md">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md"
      >
        {copied ? 'Copiado!' : 'Copiar'}
      </button>
      <pre className="overflow-auto">
        <code className="language-js">
          {code}
        </code>
      </pre>
    </div>
  );
}
