
import { useEffect, useCallback, useState } from "react";
import {
  Package, Plus, Search, Pencil, Trash2,
  X, RefreshCw, Boxes, DollarSign, AlertCircle
} from "lucide-react";
import "./App.css";

const API = "http://localhost:3000/api/products";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  stock: ""
};

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load products");
      }

      setProducts(result.data);
    } catch {
      setError(
        "Backend se connection nahi ho saka. Check karo ke server.js port 3000 par run ho raha hai."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock, 0
  );

  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock, 0
  );

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock)
    });
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      form.price.trim() === "" ||
      form.stock.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError("Saari fields sahi fill karo. Price aur stock valid numbers hon.");
      return;
    }

    setSaving(true);

    try {
      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price,
          category: form.category.trim(),
          stock
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Request failed");
      }

      resetForm();
      setNotice(
        editingId
          ? "Product successfully update ho gaya!"
          : "New product successfully add ho gaya!"
      );

      await loadProducts();
    } catch (err) {
      setError(err.message || "Product save nahi ho saka.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Kya tum "${product.name}" ko delete karna chahte ho?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API}/${product._id}`, {
        method: "DELETE"
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      if (editingId === product._id) resetForm();

      setNotice("Product delete ho gaya!");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Product delete nahi ho saka.");
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Package size={25} /></div>
          <div>
            <h2>ProductHub</h2>
            <span>Management System</span>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>
        <div className="nav-item active">
          <Boxes size={19} /> Product Catalog
        </div>

        <div className="sidebar-bottom">
          <span className="status-dot" />
          MongoDB API
          <small>Local server</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">INVENTORY / OVERVIEW</p>
            <h1>Product Catalog</h1>
            <p className="subtitle">
              Apne products aur inventory ko manage karo.
            </p>
          </div>
          <button className="button secondary refresh" onClick={loadProducts}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple"><Package size={21} /></div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
            <small>Catalog mein products</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><Boxes size={21} /></div>
            <span>Total Stock</span>
            <strong>{totalStock.toLocaleString()}</strong>
            <small>Available units</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><DollarSign size={21} /></div>
            <span>Stock Value</span>
            <strong>Rs. {totalValue.toLocaleString()}</strong>
            <small>Price × stock</small>
          </div>
        </section>

        {error && (
          <div className="alert error-alert">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {notice && <div className="alert success-alert">{notice}</div>}

        <section className="workspace">
          <div className="panel form-panel">
            <div className="panel-heading">
              <div>
                <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
                <p>{editingId ? "Product details update karo." : "Catalog mein product add karo."}</p>
              </div>
              {editingId && (
                <button className="icon-button" onClick={resetForm} title="Cancel edit">
                  <X size={18} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Product Name
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Wireless Mouse"
                  required
                />
              </label>

              <label>
                Category
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Electronics"
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  Price (Rs.)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="1500"
                    required
                  />
                </label>

                <label>
                  Stock
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="25"
                    required
                  />
                </label>
              </div>

              <button className="button primary submit-button" disabled={saving}>
                <Plus size={18} />
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Product"}
              </button>

              {editingId && (
                <button type="button" className="button secondary cancel-button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="panel products-panel">
            <div className="panel-heading list-heading">
              <div>
                <h2>All Products</h2>
                <p>{filteredProducts.length} products displayed</p>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                />
              </div>
            </div>

            {loading ? (
              <div className="empty-state">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">
                <Package size={35} />
                <strong>{search ? "No matching products" : "No products yet"}</strong>
                <span>{search ? "Search change karke dekho." : "Apna pehla product add karo."}</span>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>CATEGORY</th>
                      <th>PRICE</th>
                      <th>STOCK</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="product-name">
                            <div className="product-avatar">
                              {product.name.charAt(0).toUpperCase()}
                            </div>
                            <strong>{product.name}</strong>
                          </div>
                        </td>
                        <td><span className="category-tag">{product.category}</span></td>
                        <td className="price-cell">Rs. {product.price.toLocaleString()}</td>
                        <td>
                          <span className={`stock-badge ${product.stock === 0 ? "out" : product.stock < 10 ? "low" : "in"}`}>
                            {product.stock === 0 ? "Out of stock" : `${product.stock} units`}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <button className="icon-button edit" onClick={() => startEdit(product)} title="Edit product">
                              <Pencil size={16} />
                            </button>
                            <button className="icon-button delete" onClick={() => deleteProduct(product)} title="Delete product">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <footer>ProductHub · Product Catalog Management · React + Express + MongoDB</footer>
      </main>
    </div>
  );
}

export default App;
