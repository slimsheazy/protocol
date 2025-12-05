import React, { useState } from 'react';
import { WorkflowResult } from '../types';

interface WorkflowDisplayProps {
  data: WorkflowResult;
  onStricter: () => void;
  onLooser: () => void;
  isRegenerating: boolean;
}

export const WorkflowDisplay: React.FC<WorkflowDisplayProps> = ({ 
  data, 
  onStricter, 
  onLooser,
  isRegenerating
}) => {
  const [showReasoning, setShowReasoning] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Workflow Steps Block */}
      <div className="bg-white border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6 border-b border-gray-100 pb-2">
          Operational Workflow
        </h2>
        
        <div className="space-y-6">
          {data.steps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start group">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-900 font-mono text-sm font-bold border border-gray-200">
                {index + 1}
              </span>
              <p className="pt-1 text-lg text-gray-900 font-medium leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Bottleneck & Optimization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
          
          <div className="bg-red-50/50 border border-red-100 p-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-red-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Bottleneck
            </h3>
            <p className="text-sm text-red-900 leading-relaxed">
              {data.bottleneck}
            </p>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 p-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Optimization
            </h3>
            <p className="text-sm text-emerald-900 leading-relaxed">
              {data.optimization}
            </p>
          </div>

        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onStricter}
            disabled={isRegenerating}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
          >
            Stricter Version
          </button>
          <button
            onClick={onLooser}
            disabled={isRegenerating}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
          >
            Looser Version
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500 font-medium cursor-pointer select-none" htmlFor="reasoning-toggle">
            Show Reasoning
          </label>
          <button
            id="reasoning-toggle"
            role="switch"
            aria-checked={showReasoning}
            onClick={() => setShowReasoning(!showReasoning)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
              showReasoning ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                showReasoning ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Reasoning Panel */}
      {showReasoning && (
        <div className="bg-gray-50 border border-gray-200 p-6 text-sm text-gray-600 animate-fade-in-down">
          <h4 className="font-mono text-xs uppercase text-gray-400 mb-2">System Reasoning</h4>
          <p className="leading-relaxed">{data.reasoning}</p>
        </div>
      )}
    </div>
  );
};