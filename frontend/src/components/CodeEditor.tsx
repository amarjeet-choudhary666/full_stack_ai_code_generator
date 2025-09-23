import { useState } from 'react';

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your JavaScript code here\nconsole.log("Hello World!");');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput('');

    try {
      // Capture console.log output
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // Execute the code
      const result = eval(code);

      // Restore original console.log
      console.log = originalLog;

      // Display output
      let outputText = logs.join('\n');
      if (result !== undefined && logs.length === 0) {
        outputText = String(result);
      }

      setOutput(outputText || 'Code executed successfully (no output)');
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-center">React Code Editor</h1>
      </header>

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Code Editor</h2>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6" />
                    </svg>
                    <span>Run Code</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 bg-gray-800 border border-gray-600 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your JavaScript code here..."
              spellCheck={false}
            />
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Output</h2>
            <div className="w-full h-96 p-4 bg-black border border-gray-600 rounded-lg font-mono text-sm overflow-auto">
              {output ? (
                <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
              ) : (
                <div className="text-gray-500 italic">Output will appear here...</div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
          <ul className="text-gray-300 space-y-1">
            <li>• Write JavaScript code in the editor on the left</li>
            <li>• Click "Run Code" to execute your code</li>
            <li>• Results and console.log output will appear on the right</li>
            <li>• Use console.log() to display values</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;