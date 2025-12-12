import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:3004/api/users/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                navigate('/');
            }
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <div className="bg-white text-blue-600 font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        MM
                    </div>
                    <span className="text-xl font-bold">MicroMart</span>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <div className="bg-gray-200 text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                            {user?.firstName?.[0] || 'U'}
                        </div>
                        <span className="hidden sm:block">{user?.firstName || 'User'}</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-md w-40">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
