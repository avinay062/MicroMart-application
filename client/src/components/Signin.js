import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [response, setResponse] = useState(null);
    const navigate = useNavigate();

    const signin = async () => {
        try {
            const res = await fetch('http://localhost:3004/api/users/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailId: 'rajesh.yadav@gmail.com',
                    password: 'PassNew@0510',
                }),
            });
            const data = await res.json();
            setResponse(data);
            if (res.ok) navigate('/main');
        } catch (err) {
            console.error('Signin error:', err);
            setResponse({ error: err.message });
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
            <button onClick={signin}>Sign In</button>
            <pre>{response ? JSON.stringify(response, null, 2) : 'No response yet'}</pre>
        </div>
    );
};

export default SignIn;
