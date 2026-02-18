import { useEffect,useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminProductList(){
    const [products,setProducts]=useState([]);
    const navigate = useNavigate();

    const fetchProducts=async()=>{
        try{
            const res=await API.get("products/");
            setProducts(res.data);
        }catch(error){
            toast.error("Failed to load products");
        }
    };

    const deleteProduct=async(id)=>{
        if(!window.confirm("Are you sure?"))return;

        try{
            await API.delete(`products/${id}/`);
            toast.success("Product deleted");
            fetchProducts();

        }catch(error){
            toast.error("Delete failed");

        }
    };
    useEffect(()=>{
        fetchProducts();
    },[]);

    return(
        <div>
            <h2>Admin-Product List</h2>
            {products.length===0? (
                <p>No Products found</p>

            ):(
                <table border="1" cellpadding="10">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>


            <tbody>
                {products.map((p)=>(
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                         <td>
                  <img
                    src={p.image}
                    alt={p.name}
                    width="80"
                  />
                </td>
                <td>
                    <button onClick={()=>deleteProduct(p.id)}>Delete</button>\
                    <button onClick={()=>Navigate(`/admin/products/edit/${p.id}`)} style={{marginLeft:"5px"}}>Edit</button>
                </td>
                    </tr>
                ))}
            </tbody>
                </table>
            )}
        </div>
    );
}
export default AdminProductList;