import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import MemberManagement from './components/MemberManagement';
import TaskAssignment from './components/TaskAssignment';
import TaskStatus from './components/TaskStatus';
import { Users, LayoutList, Bot, BarChart3 } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'tasks' | 'status'>('members');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Bot className="text-blue-400" size={32} />
              <span className="font-bold text-xl tracking-tight">AI TaskForce</span>
            </div>
            <div className="flex space-x-2 md:space-x-4">
              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'members' 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Users size={18} />
                Members
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'tasks' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <LayoutList size={18} />
                Assign Tasks
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'status' 
                  ? 'bg-green-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <BarChart3 size={18} />
                Task Status
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'members' && (
          <div className="animate-fade-in">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Member Management</h1>
              <p className="text-slate-500 mt-2">Add or remove team members. These members will be available for AI assignment.</p>
            </header>
            <MemberManagement />
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="animate-fade-in">
             <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">AI Task Assignment</h1>
              <p className="text-slate-500 mt-2">Draft tasks and click "Auto-Assign All" to let the AI Agent distribute the work.</p>
            </header>
            <TaskAssignment />
          </div>
        )}

        {activeTab === 'status' && (
          <div className="animate-fade-in">
             <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Project Overview</h1>
              <p className="text-slate-500 mt-2">Track the status, timeline, and assignees of all tasks.</p>
            </header>
            <TaskStatus />
          </div>
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}