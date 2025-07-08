import { Box, Button, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function PatientDetails(){
    const {token} = useContext(AuthContext);
    const {id} = useParams();
    const [patient, setPatient]= useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/Patient/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(res => setPatient(res.data))
        .catch(err =>
            {
            console.error("Error fetching patient details: ", err)
            setError("Could not fetch details")
        });
    }, [id, token]);

    if (error) return <Typography color="error">{error}</Typography>
    if(!patient) return <Typography>Loading....</Typography>

    return (
        <Container sx={{mt:4}}>
            <Typography variant="h4" gutterBottom>
                Patient Details
            </Typography>
            <Box sx={{display:"flex", flexDirection: "column", gap: 2}}>

                <Typography><strong>Name:</strong> {patient.user?.fullName}</Typography>
        <Typography><strong>Gender:</strong> {patient.gender}</Typography>
        <Typography><strong>DOB:</strong> {patient.dob}</Typography>
        <Typography><strong>Phone:</strong> {patient.phone}</Typography>
        <Typography><strong>Address:</strong> {patient.address}</Typography>
        <Typography><strong>Email:</strong> {patient.user?.email}</Typography>
        <Typography><strong>Username:</strong> {patient.user?.userName}</Typography>
        <Button color="error" variant="contained" onClick={() =>{
            if(window.confirm("Delete this patient?")){
                api.delete(`/Patient/${id}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                .then(() => navigate("/patients"))
                .catch(err => alert("Unable to delete."))
            }
        }}>Delete Patient</Button>
            </Box>
        </Container>
    )
}