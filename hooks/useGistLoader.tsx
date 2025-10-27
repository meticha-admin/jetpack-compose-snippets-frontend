import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Copy, Check, FileCode, Loader2 } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface GistFile {
  filename: string;
  language: string;
  content: string;
  lines: string[];
  importBlocks: ImportBlock[];
  rawLines: string[];
}

interface ImportBlock {
  start: number;
  end: number;
}

interface GistData {
  files: Record<string, {
    content: string;
    filename: string;
  }>;
}

// ============================================================================
// Constants
// ============================================================================

const IMPORT_PATTERNS: Record<string, RegExp[]> = {
  javascript: [/^\s*import\s+/, /^\s*export\s+.*from\s+/, /^\s*require\s*\(/],
  typescript: [/^\s*import\s+/, /^\s*export\s+.*from\s+/, /^\s*require\s*\(/],
  python: [/^\s*import\s+/, /^\s*from\s+.*import\s+/],
  java: [/^\s*import\s+.*;/],
  kotlin: [/^\s*import\s+/],
  go: [/^\s*import\s*\(/, /^\s*import\s+"/, /^\s*\)/],
  rust: [/^\s*use\s+/, /^\s*extern\s+crate\s+/],
  ruby: [/^\s*require\s+/, /^\s*require_relative\s+/, /^\s*include\s+/],
  php: [/^\s*use\s+.*;/, /^\s*require(_once)?\s+/, /^\s*include(_once)?\s+/],
  csharp: [/^\s*using\s+.*;/],
  swift: [/^\s*import\s+/],
};

// ============================================================================
// Utility Functions
// ============================================================================

const detectLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    kt: 'kotlin',
    kts: 'kotlin',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    cs: 'csharp',
    swift: 'swift',
    cpp: 'cpp',
    c: 'c',
    h: 'c',
    css: 'css',
    html: 'html',
    json: 'json',
    xml: 'xml',
    md: 'markdown',
    sql: 'sql',
    sh: 'bash',
    yml: 'yaml',
    yaml: 'yaml',
  };
  return langMap[ext || ''] || 'plaintext';
};

const highlightCode = (code: string, language: string): string => {
  // Escape HTML first
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Create tokens array with positions
  interface Token {
    start: number;
    end: number;
    type: string;
    priority: number;
  }

  const tokens: Token[] = [];

  // Pattern definitions with priorities (higher = applied first)
  const patterns = [
    {
      type: 'comment',
      regex: /(\/\/.*|\/\*[\s\S]*?\*\/|#.*|<!--[\s\S]*?-->)/g,
      priority: 5
    },
    {
      type: 'string',
      regex: /(["'`])(?:[^\\]|\\.)*?\1/g,
      priority: 4
    },
    {
      type: 'keyword',
      regex: /\b(const|let|var|function|class|if|else|for|while|return|import|export|from|async|await|try|catch|new|this|super|extends|implements|interface|type|enum|public|private|protected|static|void|int|string|boolean|true|false|null|undefined|def|self|print|lambda|pass|break|continue|yield|with|as|in|is|not|and|or|package|struct|trait|impl|fn|mut|ref|use|crate|mod|pub|match|loop|unsafe|where|val|var|fun|object|companion|data|sealed|inner|open|override|abstract|final|lateinit|by|delegate|get|set|field|property|receiver|constructor|init|throws|typealias|suspend|inline|noinline|crossinline|reified|external|annotation|expect|actual)\b/g,
      priority: 2
    },
    {
      type: 'number',
      regex: /\b(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\b/g,
      priority: 3
    },
    {
      type: 'function',
      regex: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g,
      priority: 1
    }
  ];

  // Find all matches
  patterns.forEach(({ type, regex, priority }) => {
    let match;
    const regexCopy = new RegExp(regex.source, regex.flags);
    while ((match = regexCopy.exec(highlighted)) !== null) {
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        type,
        priority
      });
    }
  });

  // Sort by priority (high to low) then by start position
  tokens.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.start - b.start;
  });

  // Remove overlapping tokens (keep higher priority ones)
  const validTokens: Token[] = [];
  tokens.forEach(token => {
    const hasOverlap = validTokens.some(
      existing =>
        (token.start >= existing.start && token.start < existing.end) ||
        (token.end > existing.start && token.end <= existing.end) ||
        (token.start <= existing.start && token.end >= existing.end)
    );
    if (!hasOverlap) {
      validTokens.push(token);
    }
  });

  // Sort by position for applying spans
  validTokens.sort((a, b) => a.start - b.start);

  // Build final string with spans
  let result = '';
  let lastIndex = 0;

  validTokens.forEach(token => {
    // Add text before token
    result += highlighted.substring(lastIndex, token.start);
    // Add token with span
    const tokenText = highlighted.substring(token.start, token.end);
    result += `<span class="token-${token.type}">${tokenText}</span>`;
    lastIndex = token.end;
  });

  // Add remaining text
  result += highlighted.substring(lastIndex);

  return result;
};

const detectImportBlocks = (lines: string[], language: string): ImportBlock[] => {
  const patterns = IMPORT_PATTERNS[language] || [];
  if (patterns.length === 0) return [];

  const blocks: ImportBlock[] = [];
  let currentBlock: ImportBlock | null = null;

  lines.forEach((line, index) => {
    const isImport = patterns.some(pattern => pattern.test(line));
    const isEmpty = line.trim() === '';

    if (isImport) {
      if (!currentBlock) {
        currentBlock = { start: index, end: index };
      } else {
        currentBlock.end = index;
      }
    } else if (currentBlock && !isEmpty) {
      blocks.push({ ...currentBlock });
      currentBlock = null;
    } else if (currentBlock && isEmpty) {
      currentBlock.end = index;
    }
  });

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks.filter(block => block.end - block.start >= 0);
};

// ============================================================================
// Custom Hook for Gist Loading
// ============================================================================

interface UseGistLoaderResult {
  files: GistFile[];
  loading: boolean;
  error: string;
}

export const useGistLoader = (gistUrl: string): UseGistLoaderResult => {
  const [files, setFiles] = useState<GistFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!gistUrl) {
      setFiles([]);
      setError('');
      return;
    }

    const loadGist = async () => {
      setLoading(true);
      setError('');

      try {
        const gistId = gistUrl.split('/').pop()?.split('?')[0];
        if (!gistId) throw new Error('Invalid Gist URL');

        const res = await fetch(`https://api.github.com/gists/${gistId}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Gist not found. Please check the URL.');
          } else if (res.status === 403) {
            throw new Error('Rate limit exceeded. Please try again later.');
          } else {
            throw new Error(`Failed to fetch gist (${res.status})`);
          }
        }

        const data: GistData = await res.json();

        const processedFiles: GistFile[] = Object.entries(data.files || {}).map(([filename, file]) => {
          const content = file.content || '';
          const lines = content.split('\n');
          const language = detectLanguage(filename);
          const importBlocks = detectImportBlocks(lines, language);

          const highlightedLines = lines.map(line => highlightCode(line, language));

          return {
            filename,
            language,
            content,
            lines: highlightedLines,
            importBlocks,
            rawLines: lines,
          };
        });

        if (processedFiles.length === 0) {
          throw new Error('No files found in this gist');
        }

        setFiles(processedFiles);
      } catch (err) {
        console.error('Gist loading error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load gist';
        if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    loadGist();
  }, [gistUrl]);

  return { files, loading, error };
};
