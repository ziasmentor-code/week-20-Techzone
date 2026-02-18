import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

function AdminProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", start_date: "", end_date: "", image: null });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`projects/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
        setForm({ title: res.data.title, description: res.data.description, start_date: res.data.start_date, end_date: res.data.end_date, image: null });
      } catch (error) {
        toast.error("Failed to load project");
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.warning("Project title required");

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("start_date", form.start_date);
    data.append("end_date", form.end_date);
    if (form.image) data.append("image", form.image);

    try {
      const token = localStorage.getItem("token");
      await API.put(`projects/${id}/`, data, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } });
      toast.success("Project updated");
      navigate("/admin/projects/list");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto" }}>
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} />
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit">Update Project</button>
      </form>
    </div>
  );
}

export default AdminProjectEdit;
