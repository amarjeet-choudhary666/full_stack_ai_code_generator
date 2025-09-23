import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { aiService, type PromptHistoryItem } from '../../services/aiService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentPrompts, setRecentPrompts] = useState<PromptHistoryItem[]>([]);
  const [stats, setStats] = useState({
    totalPrompts: 0,
    thisWeek: 0,
    languages: {} as Record<string, number>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await aiService.getPromptHistory(1, 5);
        setRecentPrompts(response.data.history);
        
        // Calculate stats
        const totalPrompts = response.data.pagination.totalItems;
        const thisWeek = response.data.history.filter(prompt => {
          const promptDate = new Date(prompt.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return promptDate >= weekAgo;
        }).length;

        const languages = response.data.history.reduce((acc, prompt) => {
          acc[prompt.programmingLanguage] = (acc[prompt.programmingLanguage] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setStats({ totalPrompts, thisWeek, languages });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="chat-container p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              Ready to generate some amazing code today? Let's build something incredible!
            </p>
            <Link
              to="/generate"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Generate New Code</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="chat-container p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 flex-1">
                <dt className="text-sm font-medium text-gray-400 mb-1">
                  Total Prompts
                </dt>
                <dd className="text-3xl font-bold text-white">
                  {stats.totalPrompts}
                </dd>
              </div>
            </div>
          </div>

          <div className="chat-container p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 flex-1">
                <dt className="text-sm font-medium text-gray-400 mb-1">
                  This Week
                </dt>
                <dd className="text-3xl font-bold text-white">
                  {stats.thisWeek}
                </dd>
              </div>
            </div>
          </div>

          <div className="chat-container p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 flex-1">
                <dt className="text-sm font-medium text-gray-400 mb-1">
                  Languages Used
                </dt>
                <dd className="text-3xl font-bold text-white">
                  {Object.keys(stats.languages).length}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Prompts */}
        <div className="chat-container">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Prompts
              </h2>
              <Link
                to="/history"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-700">
            {recentPrompts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-4">No prompts yet. Time to create your first masterpiece!</p>
                <Link to="/generate" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Create your first prompt →
                </Link>
              </div>
            ) : (
              recentPrompts.map((prompt) => (
                <div key={prompt._id} className="p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="language-badge">
                          {prompt.programmingLanguage}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(prompt.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white font-medium mb-1">
                        {prompt.prompt}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Click to view generated code
                      </p>
                    </div>
                    <Link
                      to={`/history/${prompt._id}`}
                      className="ml-4 btn-secondary text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Language Usage */}
        {Object.keys(stats.languages).length > 0 && (
          <div className="chat-container p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Language Usage
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.languages).map(([language, count]) => (
                <div key={language} className="flex items-center justify-between">
                  <span className="text-white font-medium capitalize flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3"></div>
                    {language}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${(count / Math.max(...Object.values(stats.languages))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-300 font-semibold min-w-[2rem] text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;