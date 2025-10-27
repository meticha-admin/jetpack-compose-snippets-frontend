import React, { useEffect, useState } from "react";
import { useGistLoader } from "../hooks/useGistLoader";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FileCode,
  Loader2,
} from "lucide-react";

interface ImportBlock {
  start: number;
  end: number;
}

interface GistFile {
  filename: string;
  language: string;
  content: string;
  lines: string[]; // highlighted lines (HTML)
  importBlocks: ImportBlock[];
  rawLines: string[]; // raw text lines
}

interface GistViewerProps {
  gistUrl: string;
}

const GistViewer: React.FC<GistViewerProps> = ({ gistUrl }) => {
  const { files, loading, error } = useGistLoader(gistUrl);
  const [collapsedBlocks, setCollapsedBlocks] = useState<
    Record<string, boolean>
  >({});
  const [copiedFile, setCopiedFile] = useState<string>("");

  useEffect(() => {
    if (!files || files.length === 0) {
      setCollapsedBlocks({});
      return;
    }
    const initialCollapsed: Record<string, boolean> = {};
    files.forEach((file) => {
      file.importBlocks?.forEach((block, index) => {
        initialCollapsed[`${file.filename}-${index}`] = true;
      });
    });
    setCollapsedBlocks(initialCollapsed);
  }, [files]);

  const toggleImportBlock = (filename: string, blockIndex: number) => {
    const key = `${filename}-${blockIndex}`;
    setCollapsedBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(""), 2000);
    } catch {
      // ignore clipboard failures
    }
  };

  const renderLines = (file: GistFile) => {
    const { lines = [], importBlocks = [], filename } = file;
    const elements: JSX.Element[] = [];
    let currentLine = 0;

    importBlocks.forEach((block, blockIndex) => {
      // lines before import block
      for (let i = currentLine; i < block.start && i < lines.length; i++) {
        elements.push(
          <div key={`${filename}-line-${i}`} className="code-line">
            <span className="line-number">{i + 1}</span>
            <span
              className="line-content"
              dangerouslySetInnerHTML={{ __html: lines[i] || "&nbsp;" }}
            />
          </div>
        );
      }

      const key = `${filename}-${blockIndex}`;
      const isCollapsed = collapsedBlocks[key];
      const lineCount = Math.max(
        0,
        Math.min(block.end, lines.length - 1) - block.start + 1
      );

      if (isCollapsed) {
        elements.push(
          <div
            key={`${filename}-block-collapsed-${blockIndex}`}
            className="import-block-collapsed"
            onClick={() => toggleImportBlock(filename, blockIndex)}
          >
            <ChevronRight className="chevron" />
            <span className="import-text">
              {lineCount} import{lineCount > 1 ? "s" : ""} collapsed
            </span>
          </div>
        );
      } else {
        elements.push(
          <div
            key={`${filename}-block-header-${blockIndex}`}
            className="import-block-header"
            onClick={() => toggleImportBlock(filename, blockIndex)}
          >
            <ChevronDown className="chevron" />
            <span className="import-text">Imports</span>
          </div>
        );

        for (let i = block.start; i <= block.end && i < lines.length; i++) {
          elements.push(
            <div
              key={`${filename}-import-line-${i}`}
              className="code-line import-line"
            >
              <span className="line-number">{i + 1}</span>
              <span
                className="line-content"
                dangerouslySetInnerHTML={{ __html: lines[i] || "&nbsp;" }}
              />
            </div>
          );
        }
      }

      currentLine = Math.max(currentLine, block.end + 1);
    });

    // remaining lines
    for (let i = currentLine; i < lines.length; i++) {
      elements.push(
        <div key={`${filename}-line-${i}`} className="code-line">
          <span className="line-number">{i + 1}</span>
          <span
            className="line-content"
            dangerouslySetInnerHTML={{ __html: lines[i] || "&nbsp;" }}
          />
        </div>
      );
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="loading">
        <Loader2 size={48} className="loading-spinner" />
        <p>Fetching gist data...</p>
        <style>{loadingStyles}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <style>{loadingStyles}</style>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="empty-state">
        <h3>No gist loaded</h3>
        <p>Provide a valid GitHub Gist URL</p>
        <style>{loadingStyles}</style>
      </div>
    );
  }

  return (
    <div className="files-container">
      {files.map((file) => (
        <div key={file.filename} className="file-card">
          <div className="file-header">
            <div className="file-info">
              <FileCode className="file-icon" />
              <span className="filename">{file.filename}</span>
              <span className="language-badge">{file.language}</span>
            </div>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(file.content, file.filename)}
            >
              {copiedFile === file.filename ? (
                <>
                  <Check size={16} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy
                </>
              )}
            </button>
          </div>

          <div className="code-container">{renderLines(file)}</div>
        </div>
      ))}
      <style>{loadingStyles}</style>
    </div>
  );
};

const loadingStyles = `
.header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header p {
          color: rgba(255,255,255,0.9);
          font-size: 1.1rem;
        }

        .input-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .input-group {
          display: flex;
          gap: 0.75rem;
        }

        .input-group input {
          flex: 1;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .input-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .btn {
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102,126,234,0.4);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #c33;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          background: #111825;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
          color: #667eea;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .files-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .file-card {
          background: #1f2937;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          overflow: hidden;
          transition: all 0.3s;
          border: 1px solid rgba(75, 85, 99, 0.3);
        }

        .file-card:hover {
          box-shadow: 0 12px 48px rgba(0,0,0,0.4);
          transform: translateY(-2px);
          border-color: rgba(75, 85, 99, 0.5);
        }

        .file-header {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(75, 85, 99, 0.3);
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
        }

        .file-icon {
          width: 20px;
          height: 20px;
        }

        .filename {
          font-weight: 600;
          font-size: 1rem;
          color: #f3f4f6;
        }

        .language-badge {
          background: rgba(59, 130, 246, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #93c5fd;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .copy-btn {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #93c5fd;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .copy-btn svg {
          width: 16px;
          height: 16px;
        }

        .code-container {
          background: #111827;
          padding: 1.5rem 0;
          overflow-x: auto;
          max-height: 600px;
          overflow-y: auto;
        }

        .code-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .code-container::-webkit-scrollbar-track {
          background: #1f2937;
        }

        .code-container::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }

        .code-container::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        .code-line {
          display: flex;
          padding: 0.125rem 0;
          transition: background 0.15s;
        }

        .code-line:hover {
          background: rgba(59, 130, 246, 0.05);
        }

        .line-number {
          color: #6b7280;
          text-align: right;
          padding: 0 1.5rem;
          user-select: none;
          min-width: 60px;
          font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
        }

        .line-content {
          color: #e5e7eb;
          font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          padding-right: 1.5rem;
          white-space: pre;
        }

        .import-block-collapsed {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.5rem;
          background: rgba(59, 130, 246, 0.1);
          cursor: pointer;
          transition: all 0.2s;
          margin: 0.25rem 0;
          border-left: 2px solid rgba(59, 130, 246, 0.3);
        }

        .import-block-collapsed:hover {
          background: rgba(59, 130, 246, 0.15);
          border-left-color: rgba(59, 130, 246, 0.5);
        }

        .import-block-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.5rem;
          background: rgba(59, 130, 246, 0.12);
          cursor: pointer;
          transition: all 0.2s;
          margin: 0.25rem 0;
          border-left: 2px solid rgba(59, 130, 246, 0.4);
        }

        .import-block-header:hover {
          background: rgba(59, 130, 246, 0.18);
          border-left-color: rgba(59, 130, 246, 0.6);
        }

        .chevron {
          width: 16px;
          height: 16px;
          color: #60a5fa;
        }

        .import-text {
          color: #93c5fd;
          font-size: 0.875rem;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }

        .import-line {
          background: rgba(59, 130, 246, 0.05);
        }

        .token-keyword {
          color: #60a5fa;
          font-weight: 600;
        }

        .token-string {
          color: #f87171;
        }

        .token-comment {
          color: #6b7280;
          font-style: italic;
        }

        .token-number {
          color: #34d399;
        }

        .token-function {
          color: #fbbf24;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background: #1f2937;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          border: 1px solid rgba(75, 85, 99, 0.3);
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #f3f4f6;
        }

        .empty-state p {
          color: #9ca3af;
        }
`;

export default GistViewer;
