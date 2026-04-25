import { useEffect, useState } from 'react';
import api from '../../../api/api';
import PaginationControls from '../../../components/PaginationControls';

const STATUS_OPTIONS = ['pending', 'in_process', 'completed'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

const STATUS_STYLE = {
  pending:    { background: '#fef3c7', color: '#92400e' },
  in_process: { background: '#dbeafe', color: '#1e3a8a' },
  completed:  { background: '#d1fae5', color: '#064e3b' },
};

const BLANK_FORM = { 
  title: '', 
  total_stages: 1, 
  required_time: '', 
  priority: 'medium', 
  assigned_to: '', 
  status: 'pending', 
  task_cost: 0 
};

export default function UserTask() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });

  // Fetch Tasks and Users
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tasksRes, usersRes] = await Promise.all([
        api.get('/tasks', { params: { page, limit: 10 } }),
        api.get('/users')
      ]);

      // Handle tasks
      setTasks(tasksRes.data.tasks || tasksRes.data || []);
      setPagination(tasksRes.data.pagination || { page: 1, limit: 10, total: (tasksRes.data.tasks || []).length, totalPages: 1, hasNextPage: false, hasPrevPage: false });

      // Handle users - try multiple possible response structures
      let userList = [];
      if (usersRes.data.users) {
        userList = usersRes.data.users;
      } else if (Array.isArray(usersRes.data)) {
        userList = usersRes.data;
      } else if (usersRes.data) {
        userList = [usersRes.data]; // fallback
      }

      setUsers(userList);
      console.log("Users fetched:", userList);   // â† Debug log

    } catch (err) {
      console.error('Fetch error:', err);
      setTasks([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [page]);

  const openCreate = () => {
    setEditTask(null);
    setForm({ ...BLANK_FORM });
    setError('');
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditTask(t);
    setForm({
      title: t.title || '',
      total_stages: Number(t.total_stages) || 1,
      required_time: t.required_time || '',
      priority: t.priority || 'medium',
      assigned_to: t.assigned_to ? String(t.assigned_to) : '',
      status: t.status || 'pending',
      task_cost: Number(t.task_cost) || 0
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        title: form.title.trim(),
        total_stages: Number(form.total_stages) || 1,
        required_time: form.required_time.trim(),
        priority: form.priority,
        assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
        status: form.status,
        task_cost: parseFloat(form.task_cost) || 0
      };

      if (editTask) {
        await api.put(`/tasks/${editTask.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }

      setShowModal(false);
      fetchAll();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save task';
      setError(msg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete task "${title}"?`)) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const filtered = tasks.filter(t => {
    const matchUser = !filterUser || String(t.assigned_to) === filterUser;
    const matchStatus = !filterStatus || t.status === filterStatus;
    return matchUser && matchStatus;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter,sans-serif', padding: '2rem 1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>Task Management</h1>
          <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Assign and track tasks across team members.</p>
        </div>
        <button 
          onClick={openCreate} 
          style={{ padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '0.6rem', fontWeight: 600 }}
        >
          + Assign Task
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select 
          style={{ width: 'auto', minWidth: '180px', padding: '0.6rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#e2e8f0' }} 
          value={filterUser} 
          onChange={e => setFilterUser(e.target.value)}
        >
          <option value="">All Employees</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
        <select 
          style={{ width: 'auto', minWidth: '150px', padding: '0.6rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#e2e8f0' }} 
          value={filterStatus} 
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(st => <option key={st} value={st}>{st.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1.25rem', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#475569' }}>No tasks found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', 'Task Name', 'Assigned To', 'Stages', 'Req. Time', 'Priority', 'Status', 'Cost', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.9rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', background: '#0f172a' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} style={{ background: i % 2 === 0 ? '#1e293b' : '#172033' }}>
                    <td style={{ padding: '0.9rem 1.25rem' }}>{((pagination.page || 1) - 1) * (pagination.limit || 10) + i + 1}</td>
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>{t.title}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      {t.username ? t.username : 'Unassigned'}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>{t.total_stages}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>{t.required_time || '-'}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>{t.priority}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>{t.status}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>₹{t.task_cost}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <button onClick={() => openEdit(t)} style={{ color: '#818cf8', marginRight: '8px' }}>Edit</button>
                      <button onClick={() => handleDelete(t.id, t.title)} style={{ color: '#f87171' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!filterUser && !filterStatus && (
        <div style={{ marginTop: '1rem' }}>
          <PaginationControls
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            totalPages={pagination.totalPages}
            hasPrevPage={pagination.hasPrevPage}
            hasNextPage={pagination.hasNextPage}
            onPageChange={setPage}
            label="tasks"
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '1.5rem', width: '100%', maxWidth: '34rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                {editTask ? 'Edit Task' : 'Assign New Task'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.5rem', cursor: 'pointer' }}>Ã—</button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.5rem 2rem' }}>
              {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', padding: '0.75rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>{error}</div>}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Task Name *</label>
                <input style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#e2e8f0' }} value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} required placeholder="e.g. Design homepage wireframe" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Total Stages</label>
                  <input type="number" min="1" style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#e2e8f0' }} value={form.total_stages} onChange={e => setForm(prev => ({ ...prev, total_stages: Number(e.target.value) || 1 }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Required Time</label>
                  <input style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#e2e8f0' }} value={form.required_time} onChange={e => setForm(prev => ({ ...prev, required_time: e.target.value }))} placeholder="e.g. 5 days, 10 hours" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Priority</label>
                  <select style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#e2e8f0' }} value={form.priority} onChange={e => setForm(prev => ({ ...prev, priority: e.target.value }))}>
                    {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Task Cost (₹)</label>
                  <input type="number" step="0.01" style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#e2e8f0' }} value={form.task_cost} onChange={e => setForm(prev => ({ ...prev, task_cost: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>

              {/* Dynamic Assign To Dropdown */}
              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Assign To</label>
                <select 
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#e2e8f0' }} 
                  value={form.assigned_to} 
                  onChange={e => setForm(prev => ({ ...prev, assigned_to: e.target.value || '' }))}
                >
                  <option value="">-- Unassigned --</option>
                  {users && users.length > 0 ? (
                    users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                      </option>
                    ))
                  ) : (
                    <option disabled>No users available</option>
                  )}
                </select>
              </div>

              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Status</label>
                <select style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.75rem', color: '#e2e8f0' }} value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}>
                  {STATUS_OPTIONS.map(st => (
                    <option key={st} value={st}>{st.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', borderRadius: '0.75rem' }}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 600 }}
                >
                  {saving ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
