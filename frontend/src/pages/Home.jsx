import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD / UPDATE PRODUCT
  const addOrUpdateProduct = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/products/${editId}`, {
          name,
          price,
        });
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/products", {
          name,
          price,
        });
      }

      setName("");
      setPrice("");
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT PRODUCT
  const editProduct = (product) => {
    setName(product.name);
    setPrice(product.price);
    setEditId(product._id);
  };

  // CART
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  return (
    <div style={{ fontFamily: "Arial", background: "#f4f6f8" }}>

      {/* NAVBAR */}
      <nav
        style={{
          background: "#2c3e50",
          color: "white",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>🛒 ShopEasy</h2>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <span>Home</span>
          <span>Products</span>
          <span style={{ background: "red", padding: "5px 10px", borderRadius: "20px" }}>
            Cart ({cart.length})
          </span>

          {user ? (
            <>
              <span style={{ color: "lightgreen" }}>
                👤 {user.name}
              </span>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <a href="/login" style={{ color: "white" }}>
              Login
            </a>
          )}
        </div>
      </nav>

      {/* PRODUCT FORM */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Products</h1>

        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", margin: "5px" }}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ padding: "8px", margin: "5px" }}
        />

        <button
          onClick={addOrUpdateProduct}
          style={{
            background: "green",
            color: "white",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* PRODUCTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          padding: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>

            <button
              onClick={() => addToCart(product)}
              style={{
                background: "blue",
                color: "white",
                padding: "6px 10px",
                border: "none",
                margin: "5px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>

            <br />

            <button
              onClick={() => editProduct(product)}
              style={{ margin: "5px", cursor: "pointer" }}
            >
              Edit
            </button>

            <button
              onClick={() => deleteProduct(product._id)}
              style={{ margin: "5px", cursor: "pointer", color: "red" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div style={{ background: "white", margin: "20px", padding: "20px" }}>
        <h2>🛒 Cart</h2>

        {cart.length === 0 ? (
          <p>Cart is Empty</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index}>
                <p>
                  {item.name} - ₹{item.price}
                </p>

                <button onClick={() => removeFromCart(index)}>
                  Remove
                </button>
              </div>
            ))}

            <h3>Total: ₹{totalPrice}</h3>

            {/* ORDER BUTTON (FINAL FEATURE) */}
            <button
              onClick={async () => {
                try {
                  const user = JSON.parse(localStorage.getItem("user"));

                  if (!user) {
                    alert("Please login first");
                    return;
                  }

                  await axios.post("http://localhost:5000/orders", {
                    userId: user._id,
                    items: cart,
                    totalAmount: totalPrice,
                  });

                  alert("Order Placed Successfully!");
                  setCart([]);
                } catch (error) {
                  console.log(error);
                  alert("Order failed");
                }
              }}
              style={{
                background: "green",
                color: "white",
                padding: "10px 15px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;