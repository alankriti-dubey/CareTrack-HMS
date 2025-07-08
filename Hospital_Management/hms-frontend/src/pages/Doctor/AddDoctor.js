import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";


export default function AddDoctor() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
  gender: "",
  dob: "",
  phone: "",
  address: "",
  specialization: "",
  user: {
    userName: "",
    email: "",
    role: "doctor",
  fullName: "",

  }
});

const [error, setError] = useState("");

useEffect(() => {
    api.get("/Doctor",{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        const newId = res.data.length +1;
        setFormData(
            prev => ({
                ...prev, id: newId
            })
        )
    })
    .catch(err => {
        console.error("Error Fetching patients: ",err)
    });
}, [token]);

const handleChange = (e) => {
    const { name, value } = e.target;
if (name === "fullName") {
        // Update both patient and user full names
        setFormData(prev => ({
            ...prev,
            fullName: value,
            user: {
                ...prev.user,
                fullName: value
            }
        }));
    } else if (["userName", "email"].includes(name)) {
        setFormData(prev => ({
            ...prev,
            user: {
                ...prev.user,
                [name]: value
            }
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
};


const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/Doctor", formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(() => navigate("/doctors"))
        .catch((err) => {
            setError(err.response?.data || { title: "Failed to add doctor" })
        });
};

return (
    <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Add Doctor</Typography>
        {
            error && <Typography color="error">
                {typeof error === "string" ? error : error.title || "An error occurred"}
            </Typography>
        }
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <TextField label="Gender" name="gender" value={formData.gender} onChange={handleChange} required />
                <TextField type="date" name="dob" value={formData.dob} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                <TextField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} required />
                <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required />
                <TextField label="Username" name="userName" value={formData.user.userName} onChange={handleChange} />
                <TextField label="Email" name="email" value={formData.user.email} onChange={handleChange} required />
                <Button type="submit" variant="contained">Add Doctor</Button>

        </Box>
    </Container>
)
}
