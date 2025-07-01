import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: 0,
        fullName: "",
        gender: "",
        phone: "",
        address: "",
        email: "",
        password: "",
        role: "admin",
        userName: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


    const handleSubmit = (e) => {
        e.preventDefault();
        const { id, ...payload } = formData;
        api.post("/Auth/register", payload)
            .then(() => navigate("/login"))
            .catch((err) => {
                setError(err.response?.data || { title: "Failed to add patient" })
            });
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Register</Typography>
            {
                error && <Typography color="error">
                    {typeof error === "string" ? error : error.title || "An error occurred"}
                </Typography>
            }
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <TextField label="Gender" name="gender" value={formData.gender} onChange={handleChange} required />
                <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required />
                <TextField label="Username" name="userName" value={formData.userName} onChange={handleChange} />
                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required />
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <Button type="submit" variant="contained">Register</Button>

            </Box>
        </Container>
    )
}
