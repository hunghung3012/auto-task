import React, { useState, useEffect } from 'react';
import { TaskInput, ExpectedTask } from '../types';
import { BACKEND_URL } from '../constants';
import { Plus, CheckSquare, Square, RefreshCw, Trash2, Calendar, FileText, CheckCircle, BrainCircuit } from 'lucide-react';
import { supabase } from '../services/supabase';

const TaskAssignment: React.FC = () => {
  // DB State (Backlog: expected_tasks)
  const [backlogTasks, setBacklogTasks] = useState<ExpectedTask[]>([]);
  const [loadingBacklog, setLoadingBacklog] = useState(false);
  
  // Selection State
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());

  // Input State
  const [newTask, setNewTask] = useState<TaskInput>({ description: '', deadline: '', note: '' });
  const [isAdding, setIsAdding] = useState(false);

  // AI Processing State
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper: Date Formatter (DD/MM/YYYY HH:mm)
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No Deadline';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 1. Fetch Data
  const fetchBacklog = async () => {
    setLoadingBacklog(true);
    const { data, error } = await supabase
      .from('expected_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setBacklogTasks(data as ExpectedTask[]);
    setLoadingBacklog(false);
  };

  useEffect(() => {
    fetchBacklog();
  }, []);

  // 2. Add New Task to Backlog
  const handleAddNewTask = async () => {
    if (!newTask.description) return;
    setIsAdding(true);
    const { error } = await supabase.from('expected_tasks').insert([{
      description: newTask.description,
      deadline: newTask.deadline || null,
      note: newTask.note || null,
    }]);

    if (error) {
      alert('Error adding task: ' + error.message);
    } else {
      setNewTask({ description: '', deadline: '', note: '' });
      fetchBacklog(); 
    }
    setIsAdding(false);
  };

  // 3. Handle Selection
  const toggleSelection = (id: number) => {
    const newSet = new Set(selectedTaskIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedTaskIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedTaskIds.size === backlogTasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(backlogTasks.map(t => t.id)));
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Delete this expected task?")) return;
    const { error } = await supabase.from('expected_tasks').delete().eq('id', id);
    if (!error) {
      fetchBacklog();
      const newSet = new Set(selectedTaskIds);
      newSet.delete(id);
      setSelectedTaskIds(newSet);
    }
  };

  // 4. Trigger AI - Gọi Backend Proxy -> Gọi n8n GET
  const handleProcessAI = async () => {
    setIsProcessing(true);

    try {
      // Gọi qua backend để tránh CORS, backend sẽ gọi n8n
      const response = await fetch(`${BACKEND_URL}/api/trigger-ai`, {
        method: 'GET',
      });

      if (response.ok) {
        alert("Request sent to n8n successfully!");
        // Refresh backlog after a short delay
        setTimeout(() => {
          fetchBacklog();
          setSelectedTaskIds(new Set()); 
        }, 3000);
      } else {
        const errData = await response.json();
        throw new Error(errData.message || 'Server error');
      }

    } catch (error: any) {
      console.error(error);
      alert(`Failed to trigger: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* SECTION 1: ADD NEW TASK */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <FileText size={100} className="text-blue-600" />
        </div>
        
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <Plus className="bg-blue-600 text-white rounded-full p-1" size={24} /> 
          Create New Task
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative z-10">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-semibold text-blue-800 mb-1">Task Description</label>
            <input
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
              placeholder="What needs to be done? (e.g., Design homepage UI)"
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-blue-800 mb-1">Note (Optional)</label>
            <input
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
              placeholder="Extra details, context..."
              value={newTask.note}
              onChange={e => setNewTask({ ...newTask, note: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-800 mb-1">Deadline</label>
            <input
              type="datetime-local"
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm text-sm"
              value={newTask.deadline}
              onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end relative z-10">
          <button 
            onClick={handleAddNewTask}
            disabled={isAdding || !newTask.description}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {isAdding ? 'Saving...' : 'Add to Backlog'}
          </button>
        </div>
      </div>

      {/* SECTION 2: BACKLOG & ACTIONS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
             <button onClick={toggleSelectAll} className="text-slate-500 hover:text-slate-800 transition">
                 {backlogTasks.length > 0 && selectedTaskIds.size === backlogTasks.length 
                   ? <CheckSquare size={22} className="text-blue-600"/> 
                   : <Square size={22}/>}
             </button>
             <div>
               <h2 className="text-lg font-bold text-slate-800">Task Backlog</h2>
               <p className="text-xs text-slate-500">{backlogTasks.length} tasks waiting for assignment</p>
             </div>
          </div>
          <button onClick={fetchBacklog} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500">
            <RefreshCw size={18} className={loadingBacklog ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {backlogTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle size={48} className="mx-auto mb-3 text-slate-200" />
              <p>No tasks in backlog.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 sticky top-0 z-10 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="p-4 w-12"></th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Note</th>
                  <th className="p-4 w-40">Deadline</th>
                  <th className="p-4 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {backlogTasks.map(task => (
                  <tr 
                    key={task.id} 
                    onClick={() => toggleSelection(task.id)}
                    className={`cursor-pointer transition hover:bg-blue-50/30 ${selectedTaskIds.has(task.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="p-4 text-center">
                      {selectedTaskIds.has(task.id) 
                        ? <CheckSquare size={18} className="text-blue-600" /> 
                        : <Square size={18} className="text-slate-300" />}
                    </td>
                    <td className="p-4 font-medium text-slate-800">{task.description}</td>
                    <td className="p-4 text-slate-500 italic truncate max-w-[200px]">{task.note || '-'}</td>
                    <td className="p-4 text-slate-500">
                      {task.deadline ? (
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-xs w-fit">
                          <Calendar size={12}/> {formatDate(task.deadline)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                        className="text-slate-300 hover:text-red-500 transition p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-600">
            System will assign all tasks in backlog
          </span>
          <button 
            onClick={handleProcessAI}
            disabled={isProcessing}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition shadow-sm"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Starting...
              </>
            ) : (
              <>
                <BrainCircuit size={18} /> Auto-Assign All
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignment;