import React from 'react';
import { Settings, Play, Pause, RotateCcw, Plus, Minus, Droplets, Zap } from 'lucide-react';
import { RateLimiterConfig, SimulationConfig } from '../types';

interface ConfigPanelProps {
  config: RateLimiterConfig;
  simulation: SimulationConfig;
  isRunning: boolean;
  onConfigChange: (config: RateLimiterConfig) => void;
  onSimulationChange: (simulation: SimulationConfig) => void;
  onToggleSimulation: () => void;
  onReset: () => void;
  onManualFill?: (amount: number) => void;
  onManualDrain?: (amount: number) => void;
  onToggleAutoRefill?: () => void;
  autoRefillEnabled?: boolean;
  currentTokens?: number;
  maxTokens?: number;
  className?: string;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  simulation,
  isRunning,
  onConfigChange,
  onSimulationChange,
  onToggleSimulation,
  onReset,
  onManualFill,
  onManualDrain,
  onToggleAutoRefill,
  autoRefillEnabled = true,
  currentTokens = 0,
  maxTokens = 0,
  className = '',
}) => {
  const fillPercentage = maxTokens > 0 ? (currentTokens / maxTokens) * 100 : 0;

  return (
    <div className={`bg-gray-800 rounded-lg p-6 space-y-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Configuration</h3>
      </div>

      {/* Manual Token Bucket Controls */}
      {config.algorithm === 'token-bucket' && (
        <div className="space-y-4 bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center space-x-2 mb-3">
            <Droplets className="w-4 h-4 text-blue-400" />
            <h4 className="text-md font-medium text-gray-300">Manual Bucket Control</h4>
          </div>
          
          {/* Token Level Display */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Current Tokens</span>
              <span className="font-mono">{Math.floor(currentTokens)}/{maxTokens}</span>
            </div>
            
            {/* Visual Token Level Bar */}
            <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300 ease-out"
                style={{ width: `${fillPercentage}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow-sm">
                  {fillPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Manual Fill/Drain Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400">Add Tokens</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => onManualFill?.(1)}
                  disabled={currentTokens >= maxTokens}
                  className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>1</span>
                </button>
                <button
                  onClick={() => onManualFill?.(5)}
                  disabled={currentTokens >= maxTokens}
                  className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>5</span>
                </button>
                <button
                  onClick={() => onManualFill?.(10)}
                  disabled={currentTokens >= maxTokens}
                  className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>10</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400">Remove Tokens</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => onManualDrain?.(1)}
                  disabled={currentTokens <= 0}
                  className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                >
                  <Minus className="w-3 h-3" />
                  <span>1</span>
                </button>
                <button
                  onClick={() => onManualDrain?.(5)}
                  disabled={currentTokens <= 0}
                  className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                >
                  <Minus className="w-3 h-3" />
                  <span>5</span>
                </button>
                <button
                  onClick={() => onManualDrain?.(10)}
                  disabled={currentTokens <= 0}
                  className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
                >
                  <Minus className="w-3 h-3" />
                  <span>10</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => onManualFill?.(maxTokens - currentTokens)}
              disabled={currentTokens >= maxTokens}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
            >
              <Droplets className="w-4 h-4" />
              <span>Fill Bucket</span>
            </button>
            <button
              onClick={() => onManualDrain?.(currentTokens)}
              disabled={currentTokens <= 0}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
            >
              <Minus className="w-4 h-4" />
              <span>Empty Bucket</span>
            </button>
          </div>

          {/* Auto-Refill Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-600">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Auto Refill</span>
            </div>
            <button
              onClick={onToggleAutoRefill}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefillEnabled ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefillEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {!autoRefillEnabled && (
            <div className="text-xs text-yellow-400 bg-yellow-400/10 rounded p-2">
              ⚠️ Auto-refill is disabled. Use manual controls to add tokens.
            </div>
          )}
        </div>
      )}

      {/* Rate Limiter Config */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-300">Rate Limiter Settings</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Algorithm
          </label>
          <select
            value={config.algorithm}
            onChange={(e) => onConfigChange({
              ...config,
              algorithm: e.target.value as RateLimiterConfig['algorithm']
            })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="token-bucket">Token Bucket</option>
            <option value="sliding-window">Sliding Window</option>
            <option value="fixed-window">Fixed Window</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Requests per Second: {config.requestsPerSecond}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={config.requestsPerSecond}
            onChange={(e) => onConfigChange({
              ...config,
              requestsPerSecond: parseInt(e.target.value)
            })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Burst Capacity: {config.burstCapacity}
          </label>
          <input
            type="range"
            min="1"
            max="200"
            value={config.burstCapacity}
            onChange={(e) => onConfigChange({
              ...config,
              burstCapacity: parseInt(e.target.value)
            })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Window Size (ms): {config.windowSizeMs}
          </label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={config.windowSizeMs}
            onChange={(e) => onConfigChange({
              ...config,
              windowSizeMs: parseInt(e.target.value)
            })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Simulation Config */}
      <div className="space-y-4 border-t border-gray-700 pt-4">
        <h4 className="text-md font-medium text-gray-300">Simulation Settings</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Request Rate: {simulation.requestRate}/s
          </label>
          <input
            type="range"
            min="1"
            max="150"
            value={simulation.requestRate}
            onChange={(e) => onSimulationChange({
              ...simulation,
              requestRate: parseInt(e.target.value)
            })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Client Count: {simulation.clientCount}
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={simulation.clientCount}
            onChange={(e) => onSimulationChange({
              ...simulation,
              clientCount: parseInt(e.target.value)
            })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="burstPattern"
            checked={simulation.burstPattern}
            onChange={(e) => onSimulationChange({
              ...simulation,
              burstPattern: e.target.checked
            })}
            className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400"
          />
          <label htmlFor="burstPattern" className="text-sm font-medium text-gray-300">
            Enable Burst Pattern
          </label>
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-3 border-t border-gray-700 pt-4">
        <button
          onClick={onToggleSimulation}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Stop' : 'Start'}</span>
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};