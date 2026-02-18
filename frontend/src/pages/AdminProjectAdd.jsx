import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function AdminProjectAdd() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.warning("Project title is required");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("start_date", form.start_date);
    data.append("end_date", form.end_date);
    if (form.image) data.append("image", form.image);

    try {
      const token = localStorage.getItem("token");
      await API.post("projects/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Project added successfully");
      setForm({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        image: null,
      });
    } catch (error) {
      toast.error("Failed to add project");
      console.error(error.response || error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>Add Project</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="text" name="title" placeholder="Project Title" value={form.title} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} />
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
}

export default AdminProjectAdd;
