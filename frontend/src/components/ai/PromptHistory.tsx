import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiService, type PromptHistoryItem } from '../../services/aiService';

const PromptHistory: React.FC = () => {
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchHistory = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await aiService.getPromptHistory(page, 10);
      setHistory(response.data.history);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalItems);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    try {
      await aiService.deletePrompt(id);
      fetchHistory(currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete prompt');
    }
  };

  const handlePageChange = (page: number) => {
    fetchHistory(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="chat-container">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Prompt History
            </h2>
            <p className="text-gray-400 mt-1">Total: {totalItems} prompts</p>
          </div>

          {error && (
            <div className="mx-6 mt-4 alert-error">
              {error}
            </div>
          )}

          <div className="divide-y divide-gray-700">
            {history.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-4">No prompts found. Time to create your first code!</p>
                <Link to="/generate" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Generate your first code →
                </Link>
              </div>
            ) : (
              history.map((item) => (
                <div key={item._id} className="p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="language-badge">
                          {item.programmingLanguage}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        {item.prompt}
                      </h3>
                      <div className="code-container">
                        <div className="code-content p-3">
                          <code className="text-sm">{item.generatedCode.substring(0, 200)}...</code>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <Link
                        to={`/history/${item._id}`}
                        className="btn-secondary text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptHistory;