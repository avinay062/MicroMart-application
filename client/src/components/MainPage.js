import React, { useState, useEffect } from 'react';

const MainPage = () => {
    const [products, setProducts] = useState([]);
    const [response, setResponse] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false); // Toggle between listing and creating products
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
    });

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:30011/api/products/getAllProducts', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            console.log('Fetched products:', data);
            setProducts(data);
        } catch (err) {
            console.error('Fetch Products error:', err);
            setResponse({ error: err.message });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:30011/api/products/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setResponse(data);
            if (res.ok) {
                setFormData({ name: '', price: '', description: '' }); // Reset form
                setShowCreateForm(false); // Switch back to product listing
                fetchProducts(); // Fetch the updated product list
            }
        } catch (err) {
            console.error('Create Product error:', err);
            setResponse({ error: err.message });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Product Management</h1>
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={() => setShowCreateForm(false)}
                        className={`px-4 py-2 rounded ${
                            !showCreateForm ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                        } hover:bg-blue-700 transition`}
                    >
                        List Products
                    </button>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className={`px-4 py-2 rounded ${
                            showCreateForm ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                        } hover:bg-blue-700 transition`}
                    >
                        Create Product
                    </button>
                </div>

                {showCreateForm ? (
                    <form onSubmit={handleCreateProduct} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
                        >
                            Create Product
                        </button>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                                <p className="text-gray-700">Price: ${product.price}</p>
                                <p className="text-gray-600">{product.description}</p>
                            </div>
                        ))}
                    </div>
                )}
                <pre className="mt-6 text-sm text-gray-600 bg-gray-100 p-4 rounded">
                    {response ? JSON.stringify(response, null, 2) : ''}
                </pre>
            </div>
        </div>
    );
};

export default MainPage;
