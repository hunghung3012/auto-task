import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Member } from '../types';
import { UserPlus, Trash2, Edit2, Check, X } from 'lucide-react';

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Member>({
    full_name: '',
    email: '',
    skills: '',
    status: 'Active'
  });

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setMembers(data as Member[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('members').insert([formData]);
    if (!error) {
      fetchMembers();
      setFormData({ full_name: '', email: '', skills: '', status: 'Active' });
    } else {
      alert('Error adding member: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Are you sure?')) return;
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (!error) fetchMembers();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <UserPlus size={20} />
          Add New Member
        </h2>
        <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleInputChange}
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            name="skills"
            placeholder="Skills (e.g. React, Node)"
            value={formData.skills}
            onChange={handleInputChange}
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition font-medium">
            Add Member
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Skills</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center">Loading...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400">No members found. Add one above.</td></tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{member.full_name}</td>
                    <td className="p-4">{member.email}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                        {member.skills || 'General'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => member.id && handleDelete(member.id)} 
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                        title="Delete Member"
                      >
                        <Trash2 size={16} />
                      </button>
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

export default MemberManagement;
