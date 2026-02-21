import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext'; 
import { Suspense } from 'react';


const AuthForm = React.lazy(() => import('./components/AuthForm'));
const MainPage = React.lazy(() => import('./components/MainPage'));

const App = () => {
    return (
        <UserProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<AuthForm />} />
                            <Route path="/main" element={<MainPage />} />
                        </Routes>
                    </Suspense>
                    <Footer />
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;
