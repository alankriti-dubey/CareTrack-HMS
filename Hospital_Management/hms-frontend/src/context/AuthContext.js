import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [token, setToken] = useState(localStorage.getItem("token")||null);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        if(token){
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("payload           ",payload)
            setUserRole(payload["Role"] || null);
            localStorage.setItem("token", token);
        }
        else{
            setUserRole(null);
            localStorage.removeItem("token");
        }
    }, [token]);

    const logout = () => setToken(null);

    return(
        <AuthContext.Provider value={{ token, setToken, userRole, logout}}>
            {children}
        </AuthContext.Provider>
    );
}