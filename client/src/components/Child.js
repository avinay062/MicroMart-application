import React from 'react';

const Child = React.memo(({name, count, sendDataToParent}) => {
    const handelClick = () => {
        sendDataToParent(`Hello from Child: ${name}, Count is ${count}`);
    }
    return (
        <>
            <p>{name} has clicked {count} times.</p>
            <button onClick ={handelClick}>Send Data to Parent</button>
        </>
    );
});

export default Child;