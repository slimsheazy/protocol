import React, { useState, useCallback } from 'react';
import { generateWorkflow } from './services/geminiService';
import { Complexity, Tone, WorkflowResult } from './types';
import { Button } from './components/Button';
import { WorkflowDisplay } from './components/WorkflowDisplay';

const App: React.FC = () => {
  const [task, setTask] = useState('');
  const [complexity, setComplexity] = useState<Complexity>(Complexity.Intermediate);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (selectedTone: Tone = Tone.Neutral) => {
    if (!task.trim()) {
      setError("Please describe a task first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const workflow = await generateWorkflow(task, complexity, selectedTone);
      setResult(workflow);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [task, complexity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(Tone.Neutral);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-gray-900 selection:text-white pb-20">
      
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-white font-mono font-bold text-lg">P</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">Protocol</h1>
          </div>
          <span className="text-xs font-mono text-gray-400 hidden sm:block">v1.0.0</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        
        {/* Intro Text */}
        {!result && (
          <div className="mb-12 text-center max-w-lg mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">
              Operationalize any problem.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Strict, deterministic workflows for operations, management, and productivity.
            </p>
          </div>
        )}

        {/* Input Section */}
        <section className={`transition-all duration-500 ${result ? 'mb-12' : 'mb-8'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="task" 
                className="block text-xs font-mono uppercase tracking-wider text-gray-500"
              >
                Describe the task or problem
              </label>
              <textarea
                id="task"
                rows={result ? 2 : 5}
                className={`w-full bg-white border border-gray-200 p-4 text-base placeholder-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none shadow-sm ${result ? 'text-gray-600' : 'text-gray-900'}`}
                placeholder="e.g., Coordinate a same-day cross-country organ transplant transport..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label 
                  htmlFor="complexity" 
                  className="block text-xs font-mono uppercase tracking-wider text-gray-500"
                >
                  Complexity
                </label>
                <div className="relative">
                  <select
                    id="complexity"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value as Complexity)}
                    className="w-full appearance-none bg-white border border-gray-200 py-3 px-4 pr-8 rounded-none text-base focus:border-black focus:ring-1 focus:ring-black outline-none shadow-sm cursor-pointer"
                  >
                    <option value={Complexity.Basic}>Basic</option>
                    <option value={Complexity.Intermediate}>Intermediate</option>
                    <option value={Complexity.HighComplexity}>High-Complexity</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <Button 
                  type="submit" 
                  className="w-full py-3 h-[50px] font-mono tracking-wide"
                  isLoading={loading}
                >
                  {result ? 'REGENERATE' : 'BUILD WORKFLOW'}
                </Button>
              </div>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {result && (
          <div className="border-t border-gray-100 pt-12">
            <WorkflowDisplay 
              data={result}
              isRegenerating={loading}
              onStricter={() => handleGenerate(Tone.Stricter)}
              onLooser={() => handleGenerate(Tone.Looser)}
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;