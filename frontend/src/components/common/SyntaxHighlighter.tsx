interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code, language }) => {
  const highlightCode = (code: string): string => {
    let highlighted = code
      // Comments (green)
      .replace(/(\/\/.*$)/gm, '<span class="highlight-comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="highlight-comment">$1</span>')
      .replace(/(#.*$)/gm, '<span class="highlight-comment">$1</span>')
      
      // Strings (orange)
      .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="highlight-string">$1</span>')
      
      // Keywords (blue)
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|def|import|export|async|await|try|catch|public|private|static|void|int|string|boolean|true|false|null|undefined|None|True|False)\b/g, '<span class="highlight-keyword">$1</span>')
      
      // Numbers (light green)
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="highlight-number">$1</span>')
      
      // Functions (yellow)
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="highlight-function">$1</span>');

    return highlighted;
  };

  const highlightedCode = highlightCode(code);

  return (
    <div className="code-content">
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
};

export default SyntaxHighlighter;