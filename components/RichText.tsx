
import React, { useEffect, useRef } from 'react';
import { transformContent } from '../services/dataService';

declare var katex: any;

interface RichTextProps {
  content: string;
  className?: string;
}

const RichText: React.FC<RichTextProps> = ({ content, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Look for math elements to render
      const mathElements = containerRef.current.querySelectorAll('.math-tex');
      mathElements.forEach((el: any) => {
        try {
          const formula = el.getAttribute('data-formula') || el.textContent;
          katex.render(formula, el, { 
            throwOnError: false, 
            displayMode: el.tagName === 'DIV' 
          });
        } catch (e) {
          console.error("KaTeX error", e);
        }
      });
    }
  }, [content]);

  const prepareContent = (raw: string) => {
    let text = transformContent(raw);
    
    // Replace \( ... \) with <span class="math-tex">...</span>
    text = text.replace(/\\\((.*?)\\\)/g, (match, formula) => {
      return `<span class="math-tex" data-formula="${formula.replace(/"/g, '&quot;')}">${formula}</span>`;
    });
    
    // Replace \[ ... \] with <div class="math-tex">...</div>
    text = text.replace(/\\\[(.*?)\\\]/g, (match, formula) => {
      return `<div class="math-tex" data-formula="${formula.replace(/"/g, '&quot;')}">${formula}</div>`;
    });

    return text;
  };

  return (
    <div 
      ref={containerRef}
      className={`rich-text prose prose-slate max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: prepareContent(content) }}
    />
  );
};

export default RichText;
