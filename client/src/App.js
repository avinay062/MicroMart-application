import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import MainPage from './components/MainPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext'; 

const App = () => {
    return (
        <UserProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<AuthForm />} />
                            <Route path="/main" element={<MainPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;
