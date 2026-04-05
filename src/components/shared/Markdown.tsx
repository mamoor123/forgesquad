'use client';

import React from 'react';

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((codePart, j) => {
        if (codePart.startsWith('`') && codePart.endsWith('`')) {
          return (
            <code key={`${i}-${j}`} className="px-1.5 py-0.5 bg-[#111827] rounded text-sm font-mono text-cyan-400">
              {codePart.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={`${i}-${j}`}>{codePart}</React.Fragment>;
      });
    });
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  let codeLang = '';

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCode) { inCode = true; codeLang = line.slice(3).trim(); codeBuf = []; }
      else {
        inCode = false;
        elements.push(
          <div key={`c${i}`} className="my-3 rounded-lg bg-[#060912] border border-[#1e2740] overflow-hidden">
            {codeLang && <div className="px-3 py-1.5 text-xs text-gray-500 bg-[#111827] border-b border-[#1e2740] font-mono">{codeLang}</div>}
            <pre className="p-3 overflow-x-auto text-sm font-mono text-gray-300"><code>{codeBuf.join('\n')}</code></pre>
          </div>
        );
      }
      return;
    }
    if (inCode) { codeBuf.push(line); return; }
    if (line.startsWith('### ')) elements.push(<h3 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.slice(4)}</h3>);
    else if (line.startsWith('## ')) elements.push(<h2 key={i} className="text-xl font-semibold text-white mt-5 mb-2">{line.slice(3)}</h2>);
    else if (line.startsWith('# ')) elements.push(<h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{line.slice(2)}</h1>);
    else if (line.startsWith('- [x] ')) elements.push(<div key={i} className="flex items-center gap-2 ml-2 text-green-400"><span className="w-4 h-4 bg-green-600 border border-green-600 rounded flex items-center justify-center text-xs">✓</span>{renderInline(line.slice(6))}</div>);
    else if (line.startsWith('- [ ] ')) elements.push(<div key={i} className="flex items-center gap-2 ml-2 text-gray-400"><span className="w-4 h-4 border border-gray-600 rounded" />{renderInline(line.slice(6))}</div>);
    else if (line.startsWith('- ')) elements.push(<li key={i} className="ml-4 text-gray-300 list-disc list-inside">{renderInline(line.slice(2))}</li>);
    else if (line.match(/^\d+\. /)) elements.push(<li key={i} className="ml-4 text-gray-300 list-decimal list-inside">{renderInline(line.replace(/^\d+\. /, ''))}</li>);
    else if (line.startsWith('---')) elements.push(<hr key={i} className="my-4 border-[#2a3655]" />);
    else if (line.trim() === '') elements.push(<div key={i} className="h-2" />);
    else elements.push(<p key={i} className="text-gray-300 leading-relaxed">{renderInline(line)}</p>);
  });

  return <div className="font-mono text-sm leading-relaxed">{elements}</div>;
}
