import { Box, Button, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function DoctorDetails(){
    const {token} = useContext(AuthContext);
    const {id} = useParams();
    const [Doctor, setDoctor]= useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/Doctor/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(res => setDoctor(res.data))
        .catch(err =>
            {
            console.error("Error fetching Doctor details: ", err)
            setError("Could not fetch details")
        });
    }, [id, token]);

    if (error) return <Typography color="error">{error}</Typography>
    if(!Doctor) return <Typography>Loading....</Typography>

    return (
        <Container sx={{mt:4}}>
            <Typography variant="h4" gutterBottom>
                Doctor Details
            </Typography>
            <Box sx={{display:"flex", flexDirection: "column", gap: 2}}>

                <Typography><strong>Name:</strong> {Doctor.user.fullName}</Typography>
        <Typography><strong>Gender:</strong> {Doctor.gender}</Typography>
        <Typography><strong>DOB:</strong> {Doctor.dob}</Typography>
        <Typography><strong>Phone:</strong> {Doctor.phone}</Typography>
        <Typography><strong>Address:</strong> {Doctor.address}</Typography>
        <Typography><strong>Email:</strong> {Doctor.user?.email}</Typography>
        <Typography><strong>Username:</strong> {Doctor.user?.userName}</Typography>
        <Button color="error" variant="contained" onClick={() =>{
            if(window.confirm("Delete this Doctor?")){
                api.delete(`/Doctor/${id}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                .then(() => navigate("/doctors"))
                .catch(err => alert("Unable to delete."))
            }
        }}>Delete Doctor</Button>
            </Box>
        </Container>
    )
}