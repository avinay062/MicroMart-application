import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 text-center py-4 dark:bg-slate-950 dark:text-slate-400">
            <p>&copy; {currentYear} MicroMart. All rights reserved.</p>
        </footer>
    );
};

export default Footer;