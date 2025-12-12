import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white text-center py-4">
            <p>&copy; {currentYear} MicroMart. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
