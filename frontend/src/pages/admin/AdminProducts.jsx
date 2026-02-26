import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  Plus, Edit, Trash2, Search, X, Save, 
  Image as ImageIcon, Package, DollarSign, 
  Layers, Archive, Upload 
} from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });

  // Fetch products and categories on load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin-products/');
      console.log('Products fetched:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories/');
      console.log('Categories fetched:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: null
    });
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleOpenModal = (product = null) => {
    console.log('Opening modal with product:', product);
    
    if (product) {
      // Edit mode
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        image: null
      });
      setImagePreview(product.image || null);
    } else {
      // Add mode
      resetForm();
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form:', formData);
    
    // Validation
    if (!formData.name) {
      alert('Please enter product name');
      return;
    }
    if (!formData.price) {
      alert('Please enter price');
      return;
    }
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    if (!formData.stock) {
      alert('Please enter stock quantity');
      return;
    }

    setSubmitting(true);

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description || '');
    productData.append('price', formData.price);
    productData.append('category', formData.category);
    productData.append('stock', formData.stock);
    
    if (formData.image) {
      productData.append('image', formData.image);
    }

    try {
      let response;
      
      if (editingProduct) {
        // Update existing product
        console.log('Updating product ID:', editingProduct.id);
        response = await API.put(`/admin-products/${editingProduct.id}/`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Update response:', response.data);
        alert('Product updated successfully!');
      } else {
        // Add new product
        console.log('Adding new product');
        response = await API.post('/admin-products/', productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Add response:', response.data);
        alert('Product added successfully!');
      }
      
      handleCloseModal();
      fetchProducts(); // Refresh the list
      
    } catch (error) {
      console.error('Error saving product:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Failed to save product'}`);
      } else {
        alert('Error saving product. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/admin-products/${id}/`);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00e676] border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-bold">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">
              <span className="text-[#00e676]">PRODUCT</span> MANAGEMENT
            </h1>
            <p className="text-gray-400">Manage your product inventory</p>
          </div>
          
          {/* Add New Product Button */}
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#00e676] hover:bg-white text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] transition-all text-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl">
            <Package size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-xl text-gray-400 mb-4">No products found</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-[#00e676] hover:bg-white text-black font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#00e676]/30 transition-all group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-black">
                  <img
                    src={product.image || 'https://via.placeholder.com/400x300/1a1a1a/00e676?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-[#00e676] transition-all cursor-pointer"
                    >
                      <Edit size={16} className="text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description || 'No description'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-[#00e676]" />
                      <span className="text-gray-300">Price:</span>
                      <span className="font-bold">₹{product.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Layers size={16} className="text-[#00e676]" />
                      <span className="text-gray-300">Category:</span>
                      <span className="font-bold">{product.category_name || 'Uncategorized'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Archive size={16} className="text-[#00e676]" />
                      <span className="text-gray-300">Stock:</span>
                      <span className={`font-bold ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                        {product.stock} units
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-xs text-gray-500">ID: #{product.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={handleCloseModal}
            />

            {/* Modal Content */}
            <div className="relative bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
              <div className="sticky top-0 bg-gray-900 p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-black">
                  <span className="text-[#00e676]">{editingProduct ? 'EDIT' : 'ADD'}</span> PRODUCT
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-black rounded-xl overflow-hidden border border-white/10">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={24} className="text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl cursor-pointer transition w-fit"
                        >
                          <Upload size={16} />
                          Upload Image
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] transition text-white"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] transition text-white"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] transition text-white"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] transition text-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-gray-800">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] transition text-white"
                      placeholder="Enter product description"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`bg-[#00e676] hover:bg-white text-black font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                      submitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}