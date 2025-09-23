import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aiService, type PromptHistoryItem } from '../../services/aiService';
import { PROGRAMMING_LANGUAGES, type ProgrammingLanguage } from '../../types';

const PromptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<PromptHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('javascript');

  useEffect(() => {
    if (!id) return;

    const fetchPrompt = async () => {
      try {
        const response = await aiService.getPromptById(id);
        setPrompt(response.data);
        setSelectedLanguage(response.data.programmingLanguage as ProgrammingLanguage);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch prompt');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  const handleRegenerate = async () => {
    if (!id) return;

    setRegenerating(true);
    setError('');

    try {
      const response = await aiService.regenerateCode(id, selectedLanguage);
      setPrompt(prev => prev ? {
        ...prev,
        generatedCode: response.data.generatedCode,
        programmingLanguage: response.data.language
      } : null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to regenerate code');
    } finally {
      setRegenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.generatedCode);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this prompt?')) return;

    try {
      await aiService.deletePrompt(id);
      navigate('/history');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete prompt');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Prompt not found</h2>
          <button
            onClick={() => navigate('/history')}
            className="btn-secondary"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="chat-container">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Prompt Details
                </h2>
                <p className="text-gray-400 mt-1">
                  Created on {new Date(prompt.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/history')}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {error && (
              <div className="alert-error">
                {error}
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Original Prompt
              </h3>
              <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg">
                <p className="text-white font-medium">{prompt.prompt}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Generated Code
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="language-badge">
                    {prompt.programmingLanguage}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="copy-btn"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="code-container">
                <div className="code-content">
                  <pre><code>{prompt.generatedCode}</code></pre>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate Code
              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label htmlFor="language" className="form-label">
                    Programming Language
                  </label>
                  <select
                    id="language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as ProgrammingLanguage)}
                    className="form-select w-full"
                  >
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="btn-primary flex items-center space-x-2"
                >
                  {regenerating ? (
                    <>
                      <div className="loading-spinner w-4 h-4"></div>
                      <span>Regenerating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Regenerate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;