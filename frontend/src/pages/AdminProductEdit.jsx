import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  // 🔹 FETCH PRODUCT
  const fetchProduct = async () => {
    try {
      const res = await API.get(`products/${id}/`);
      setForm({
        name: res.data.name,
        price: res.data.price,
        description: res.data.description,
        image: null, // image reselect cheyyanam
      });
    } catch (error) {
      toast.error("Failed to load product");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  // 🔹 UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      toast.warning("Name & Price required");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);
    if (form.image) {
      data.append("image", form.image);
    }

    try {
      await API.put(`products/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated");
      navigate("/admin/products/list");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div>
      <h2>Admin - Edit Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          placeholder="Product Name"
          onChange={handleChange}
        />

        <input
          name="price"
          value={form.price}
          placeholder="Price"
          onChange={handleChange}
        />

        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={handleChange}
        />

        <input type="file" name="image" onChange={handleChange} />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default AdminProductEdit;

