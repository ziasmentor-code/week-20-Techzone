import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null, name: '', price: '', description: '', category: '', image: null
  });

  // CORRECT BASE URL: Inthil '/api/' repeat cheyyaruthu
  const API_BASE = 'http://127.0.0.1:8000/api/products/';

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Axios calls checking for correct endpoints
      const [pRes, cRes] = await Promise.all([
        axios.get(API_BASE, config),
        axios.get('http://127.0.0.1:8000/api/categories/', config)
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // DELETE FUNCTION (Fixed with ID and Slash)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem('access');
      // ID-kku shesham '/' nalkunnath Django-il nirbandhamaanu
      await axios.delete(`${API_BASE}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update UI after delete
      setProducts(products.filter(p => p.id !== id));
      alert("Product Deleted!");
    } catch (err) {
      console.error("Delete Error details:", err.response?.data);
      alert("Delete failed. Check console for details.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const formData = new FormData();
    formData.append('name', currentProduct.name);
    formData.append('price', currentProduct.price);
    formData.append('description', currentProduct.description);
    formData.append('category', currentProduct.category);
    
    if (currentProduct.image instanceof File) {
      formData.append('image', currentProduct.image);
    }

    const config = {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    };

    try {
      if (isEditing) {
        // PUT URL fix
        await axios.put(`${API_BASE}${currentProduct.id}/`, formData, config);
      } else {
        // POST URL fix
        await axios.post(API_BASE, formData, config);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Error saving product: " + JSON.stringify(err.response?.data));
    }
  };

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Loading Tech Zone Admin...</div>;

  return (
    <div style={{ padding: '20px', background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Product Management</h2>
        <button 
          onClick={() => {
            setCurrentProduct({id: null, name: '', price: '', description: '', category: '', image: null});
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          style={{ padding: '10px 20px', background: '#f0a500', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          + Add Product
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th style={{ padding: '15px', textAlign: 'left' }}>Image</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Price</th>
            <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '15px' }}>
                <img src={p.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
              </td>
              <td style={{ padding: '15px' }}>{p.name}</td>
              <td style={{ padding: '15px', color: '#2ecc71' }}>${p.price}</td>
              <td style={{ padding: '15px', textAlign: 'right' }}>
                <button 
                  onClick={() => { setCurrentProduct({...p, image: null}); setIsEditing(true); setIsModalOpen(true); }}
                  style={{ marginRight: '10px', padding: '5px 10px', background: 'transparent', border: '1px solid #3498db', color: '#3498db', cursor: 'pointer' }}
                >Edit</button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', cursor: 'pointer' }}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Simplified Modal Logic can be added here as per previous design */}
    </div>
  );
};

export default AdminProducts;