import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { DbTask } from '../types';
import { RefreshCw, Calendar, Clock, AlertCircle } from 'lucide-react';

const TaskStatus: React.FC = () => {
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper: Date Formatter for Vietnamese style (DD/MM/YYYY HH:mm:ss)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const fetchTasks = async () => {
    setLoading(true);
    // Fetch all tasks
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setTasks(data as DbTask[]);
    } else if (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Task Status Board</h2>
           <p className="text-sm text-slate-500">Monitor all assigned tasks and their progress.</p>
        </div>
        <button 
          onClick={fetchTasks} 
          className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* Using min-w-max to ensure table doesn't squish too much, simulating a spreadsheet view */}
          <table className="w-full text-left text-sm text-slate-700 min-w-max">
            <thead className="bg-orange-100 text-slate-800 border-b border-orange-200 uppercase font-bold text-xs">
              <tr>
                <th className="p-3 w-16 text-center border-r border-slate-200">ID</th>
                <th className="p-3 w-64 border-r border-slate-200 bg-orange-100">Task Name</th>
                <th className="p-3 w-48 border-r border-slate-200 bg-orange-100">Assignee</th>
                <th className="p-3 w-48 border-r border-slate-200 bg-orange-100">Email</th>
                <th className="p-3 w-32 border-r border-slate-200 bg-orange-100">Status</th>
                <th className="p-3 w-40 border-r border-slate-200 bg-green-100">Start</th>
                <th className="p-3 w-40 border-r border-slate-200 bg-orange-100">End</th>
                <th className="p-3 w-40 border-r border-slate-200 bg-orange-100">Deadline</th>
                <th className="p-3 min-w-[300px] border-r border-slate-200 bg-orange-100">Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-slate-400">Loading data...</td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-slate-400">No tasks found in database.</td></tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 text-center border-r border-slate-100 text-slate-500 font-mono">
                      {task.id}
                    </td>
                    <td className="p-3 font-semibold text-blue-700 border-r border-slate-100">
                      {task.task_name}
                    </td>
                    <td className="p-3 border-r border-slate-100 font-medium">
                      {task.assignee || '-'}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-xs text-slate-500">
                      {task.email || '-'}
                    </td>
                    <td className="p-3 border-r border-slate-100">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold border ${
                        task.status === 'Done' ? 'bg-green-100 text-green-700 border-green-200' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {task.status || 'To Do'}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-100 text-xs font-mono bg-green-50/50">
                      {formatDate(task.start)}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-xs font-mono">
                      {formatDate(task.end)}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-xs font-mono font-medium text-red-600">
                      {formatDate(task.deadline)}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-xs text-slate-600 italic">
                      {task.reasoning}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskStatus;