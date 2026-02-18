import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function AdminProductAdd() {
  const [form, setForm] = useState({ name: "", price: "", description: "", image: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.warning("All fields required");

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);
    if (form.image) data.append("image", form.image);

    try {
      const token = localStorage.getItem("token");
      await API.post("products/", data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      toast.success("Product added");
      setForm({ name: "", price: "", description: "", image: null });
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto" }}>
      <h2>Add Product</h2>
      <form style={{ display: "flex", flexDirection: "column", gap: "15px" }} onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AdminProductAdd;
