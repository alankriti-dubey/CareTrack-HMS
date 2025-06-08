import { Button, Container, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";


export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const res = await api.post("/Auth/login", {email, password});
            setToken(res.data.token.result);
            console.log("token            ",res.data.token.result)
            navigate("/patients");
        }
        catch{
            setError("Invalid Email or password")
        }
    };
    
    return(
        <Container maxWidth="xs" sx={{mt : 10}}>
            <Typography variant="h4" gutterBottom> Login </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" fullWidth sx={{mt:2}}>Login</Button>
            </form>
        </Container>
    );
}