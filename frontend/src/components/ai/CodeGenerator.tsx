import { useState } from 'react';
import { aiService } from '../../services/aiService';
import { PROGRAMMING_LANGUAGES, type ProgrammingLanguage } from '../../types';
import SyntaxHighlighter from '../common/SyntaxHighlighter';

const CodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeStats, setCodeStats] = useState<{ length: number; lines: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setGeneratedCode('');
    setCodeStats(null);

    try {
      const response = await aiService.generateCode({ prompt, language });
      setGeneratedCode(response.data.generatedCode);
      setCodeStats({
        length: response.data.codeLength,
        lines: response.data.linesOfCode
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const clearCode = () => {
    setGeneratedCode('');
    setCodeStats(null);
    setError('');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            AI Code Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Generate beautiful, commented code in any programming language
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="chat-container p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code Request
              </h2>
              <p className="text-gray-400 text-sm">Describe what you want to build</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Language Selection */}
              <div>
                <label htmlFor="language" className="form-label">
                  Programming Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                  className="form-select w-full"
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prompt Input */}
              <div>
                <label htmlFor="prompt" className="form-label">
                  What do you want to build?
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="form-textarea w-full"
                  placeholder="e.g., Create a user authentication function with email validation, password hashing, and JWT token generation"
                  required
                />
                <div className="mt-2 text-sm text-gray-400">
                  Be specific for better results. Include details about functionality, error handling, and requirements.
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Generating Code...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Code</span>
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="alert-error mt-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="chat-container p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generated Code
              </h2>
              {codeStats && (
                <p className="text-gray-400 text-sm">
                  {codeStats.lines} lines • {codeStats.length} characters
                </p>
              )}
            </div>

            {!generatedCode && !loading && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <p className="text-lg font-medium">Your code will appear here</p>
                <p className="text-sm">Enter a prompt and click generate to get started</p>
              </div>
            )}

            {generatedCode && (
              <div className="code-container">
                <div className="code-header">
                  <div className="flex items-center space-x-3">
                    <span className="language-badge">{language}</span>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="copy-btn flex items-center space-x-1"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={clearCode}
                      className="copy-btn flex items-center space-x-1"
                      title="Clear code"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
                <div className="code-content">
                  <SyntaxHighlighter code={generatedCode} language={language} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Quick Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Authentication Function",
                description: "Create a secure user login system with JWT",
                prompt: "Create a user authentication function with email validation, password hashing using bcrypt, and JWT token generation"
              },
              {
                title: "API Endpoint",
                description: "Build a REST API endpoint with validation",
                prompt: "Create a REST API endpoint for user registration with input validation, error handling, and database integration"
              },
              {
                title: "Data Processing",
                description: "Process and analyze data efficiently",
                prompt: "Create a function to process CSV data, calculate statistics, and export results with error handling"
              }
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example.prompt)}
                className="text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200 hover:border-cyan-400"
              >
                <h4 className="font-semibold text-white mb-2">{example.title}</h4>
                <p className="text-gray-400 text-sm">{example.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;