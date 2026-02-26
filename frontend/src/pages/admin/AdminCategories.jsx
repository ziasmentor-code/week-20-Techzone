import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory.id}/`, formData);
        alert('Category updated successfully!');
      } else {
        await API.post('/categories/', formData);
        alert('Category added successfully!');
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await API.delete(`/categories/${id}/`);
        alert('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">
            <span className="text-[#00e676]">CATEGORY</span> MANAGEMENT
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#00e676] hover:bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={20} /> Add Category
          </button>
        </div>

        <div className="bg-white/5 rounded-2xl p-6">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="font-bold text-xl">{cat.name}</h3>
                <p className="text-gray-400">{cat.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingCategory(cat); setFormData(cat); setShowModal(true); }} className="p-2 hover:bg-white/10 rounded">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-500/20 rounded">
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editingCategory ? 'Edit' : 'Add'} Category</h2>
                <button onClick={() => { setShowModal(false); setEditingCategory(null); setFormData({ name: '', description: '' }); }}>
                  <X />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mb-4"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 mb-6"
                  rows="3"
                />
                <button type="submit" className="w-full bg-[#00e676] text-black font-bold py-3 rounded-xl">
                  <Save size={18} className="inline mr-2" />
                  {editingCategory ? 'Update' : 'Save'} Category
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}