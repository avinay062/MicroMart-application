import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [response, setResponse] = useState(null);
    const navigate = useNavigate();

    const signup = async () => {
        try {
            const res = await fetch('http://localhost:3004/api/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: 'Avinay',
                    lastName: 'kumar',
                    emailId: 'avinay.kumar@gmail.com',
                    password: 'PassNew@0510',
                }),
            });
            const data = await res.json();
            setResponse(data);
            if (res.ok) navigate('/');
        } catch (err) {
            console.error('Signup error:', err);
            setResponse({ error: err.message });
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <button onClick={signup}>Signup</button>
            <pre>{response ? JSON.stringify(response, null, 2) : 'No response yet'}</pre>
        </div>
    );
};

export default Signup;
