import React, { createContext, useState } from 'react';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};




/*Create Context: UserContext is created using createContext().
State Management: The user state and its updater function setUser are created using useState.
Provider Component: The UserProvider component wraps child components and provides the user state and setUser function to them via the UserContext.Provider.
Accessing Context: Any component within the UserProvider tree can use the useContext(UserContext) hook to access or update the user state.*/