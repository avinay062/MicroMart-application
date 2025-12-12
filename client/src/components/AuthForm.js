import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import UserContext

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        emailId: '',
        password: '',
    });
    const [response, setResponse] = useState(null);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext); // Access setUser from UserContext

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const url = isSignUp
            ? 'http://localhost:3004/api/users/signup'
            : 'http://localhost:3004/api/users/signin';

        const body = isSignUp
            ? {
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  emailId: formData.emailId,
                  password: formData.password,
              }
            : {
                  emailId: formData.emailId,
                  password: formData.password,
              };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'include',
            });
            const data = await res.json();
            setResponse(data);

            if (res.ok && !isSignUp) {
                setUser(data); // Set user data in context
                navigate('/main'); // Navigate to main page after successful Sign In
            }
        } catch (err) {
            console.error(`${isSignUp ? 'Sign Up' : 'Sign In'} error:`, err);
            setResponse({ error: err.message });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {isSignUp ? 'Create an Account' : 'Welcome Back'}
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-4"
                >
                    {isSignUp && (
                        <>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </>
                    )}
                    <input
                        type="email"
                        name="emailId"
                        placeholder="Email Address"
                        value={formData.emailId}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-300"
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>
                {isSignUp ? (
                    <p className="mt-4 text-center text-gray-600">
                        Already have an account?{' '}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => setIsSignUp(false)}
                        >
                            Sign In
                        </span>
                    </p>
                ) : (
                    <p className="mt-4 text-center text-gray-600">
                        New to the application?{' '}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => setIsSignUp(true)}
                        >
                            Create an account
                        </span>
                    </p>
                )}
                <pre className="mt-4 text-sm text-gray-600 bg-gray-100 p-4 rounded">
                    {response ? JSON.stringify(response, null, 2) : ''}
                </pre>
            </div>
        </div>
    );
};

export default AuthForm;
