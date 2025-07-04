import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function Editdoctor(){
    const {id} = useParams();
    const navigate = useNavigate();
    const {token} = useContext(AuthContext)

    const [doctorData, setdoctorData] = useState({
        fullName: "",
    gender: "",
    dob: "",
    phone: "",
    address: "",
    user: {
      email: "",
      userName:""
    }
    });

    useEffect(() => {
        api.get(`/Doctor/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then((res) => {
            setdoctorData(res.data);
            console.log(res)
        })
        .catch((err) => {
            console.error("Failed to fecth doctor ", err)
            alert("Error fetching doctor data.");
        })
    }, [id, token])

    const handleChange = (e) => {
        const {name, value} = e.target;

        if(["email", "userName"].includes(name)){
            setdoctorData(prev => ({
                ...prev,
                user:{
                    ...prev.user,
                    [name
                    ]: value
                }
            }));
        }
        else{
            setdoctorData({ ...doctorData, [name]:value});
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        api.put(`/doctor/${id}`, doctorData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(() => {
            alert("doctor data updated successfully!");
            navigate("/doctors");
        })
        .catch((err) => {
            console.error("Error updating doctor", err)
            alert("Update failed.")
        })
    }

    return (
        <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Edit doctor</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField label="Full Name" name="fullName" value={doctorData.fullName} onChange={handleChange} required />
                <TextField label="Gender" name="gender" value={doctorData.gender} onChange={handleChange} required />
                <TextField type="date" name="dob" value={doctorData.dob} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                <TextField label="Phone" name="phone" value={doctorData.phone} onChange={handleChange} required />
                <TextField label="Address" name="address" value={doctorData.address} onChange={handleChange} required />
                <TextField label="Username" name="userName" value={doctorData.user.userName} onChange={handleChange} />
                <TextField label="Email" name="email" value={doctorData.user.email} onChange={handleChange} required />
                <Button type="submit" variant="contained">Update Doctor</Button>

        </Box>
    </Container>
    )
}