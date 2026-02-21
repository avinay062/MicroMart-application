import React, { useState, useMemo, useCallback } from "react";
import Child from './Child';


const Parent = () => {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('Avinay');
    const [childData, setChildData] = useState('');

    // Using useMemo to memoize a computed value
    const doubledCount = useMemo(() => {
        console.log("Calculating doubled count...");
        return count * 2;
    }, [count]);

    // Using useCallback to memoize a callback function
    const handleChildData = useCallback((data) => {
        setChildData(data);
    }, []);

    return (
        <>
           <h1>Parent component</h1>
           <button onClick={() => setCount(count + 1)}>Increment Count</button>
           <button onClick={() => setName(name === 'Avinay' ? 'Kumar' : 'Avinay')}>Change Name</button>
           <p>Count: {count}</p>
           <p>Doubled Count (useMemo): {doubledCount}</p>
           <Child name={name} count={count} sendDataToParent={handleChildData} />
           <p>Data from Child: {childData}</p>
        </>
        
    );
};

export default Parent;