import { Box, Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPatient(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [patientData, setPatientData] = useState({
        fullName: "",
    gender: "",
    dob: "",
    phone: "",
    address: "",
    user: {
      email: ""
    }
    });

    useEffect(() => {
        axios.get(`/api/Patient/${id}`)
        .then((res) => {
            setPatientData(res.data);
        })
        .catch((err) => {
            console.error("Failed to fecth patient ", err)
            alert("Error fetching patient data.");
        })
    }, [id])

    const handleChange = (e) => {
        const {name, value} = e.target;

        if(name === "email"){
            setPatientData({...patientData, user:{ ...patientData.user, email:value}});
        }
        else{
            setPatientData({ ...patientData, [name]:value});
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`/api/Patient/${id}`, patientData)
        .then(() => {
            alert("Patient data updated successfully!");
            navigate("/patients");
        })
        .catch((err) => {
            console.error("Error updating patient", err)
            alert("Update failed.")
        })
    }

    return (
        <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Edit Patient</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField label="Full Name" name="fullName" value={patientData.fullName} onChange={handleChange} required />
                <TextField label="Gender" name="gender" value={patientData.gender} onChange={handleChange} required />
                <TextField type="date" name="dob" value={patientData.dob} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                <TextField label="Phone" name="phone" value={patientData.phone} onChange={handleChange} required />
                <TextField label="Address" name="address" value={patientData.address} onChange={handleChange} required />
                <TextField label="Username" name="userName" value={patientData.user.userName} onChange={handleChange} />
                <TextField label="Email" name="email" value={patientData.user.email} onChange={handleChange} required />
                <Button type="submit" variant="contained">Add Patient</Button>

        </Box>
    </Container>
    )
}