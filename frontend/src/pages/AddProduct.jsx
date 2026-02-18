import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function AdminProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.image) {
      toast.warning("⚠️ All fields required");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("image", form.image);

    try {
      await API.post("products/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Product added successfully");

      setForm({
        name: "",
        price: "",
        description: "",
        image: null,
      });
    } catch (error) {
      toast.error("❌ Product add failed");
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin - Add Product</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "30px auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
};

export default AdminProduct;
