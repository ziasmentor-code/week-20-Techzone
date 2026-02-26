import { useEffect, useState } from "react";
import axios from "axios";

function ProductList() {
    const [products, setProducts] = useState([]);
    const BASE_URL = "http://127.0.0.1:8000";

    useEffect(() => {
        const getProducts = async () => {
            try {
                // Must use the correct endpoint from your Django backend
                const res = await axios.get(`${BASE_URL}/api/admin-products/`);
                setProducts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getProducts();
    }, []);

    return (
        <div style={{ padding: "100px 20px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                {products.map((p) => (
                    <div key={p.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", background: "white" }}>
                        <img src={p.image ? (p.image.startsWith('http') ? p.image : `${BASE_URL}${p.image}`) : ""} alt={p.name} style={{ width: "100%", height: "200px", objectFit: "contain" }} />
                        <h3>{p.name}</h3>
                        <p style={{ color: "green", fontWeight: "bold" }}>₹{p.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;