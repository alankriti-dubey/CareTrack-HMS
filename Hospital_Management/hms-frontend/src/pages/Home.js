import { Box, Button, Container, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
    const { userRole } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <Container sx={{ mt: 6, textAlign: "center" }}>
            <Typography variant="h3" gutterBottom>
                Welcome to Caretrack HMS
            </Typography>
            <Typography variant="h5" gutterBottom>
                Your Role: {userRole}
            </Typography>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 4 }}>
                <Button variant="contained" onClick={() => navigate("/patients")}>
                    Manage Patients
                </Button>
                {
                    userRole == "admin" && (
                        <>
                            <Button variant="contained" onClick={() => navigate("/doctors")}>
                                Manage Doctors
                            </Button>
                            <Button variant="contained" onClick={() => navigate("/appointments")}>
                                Show Appointments
                            </Button>
                        </>

                    )
                }
            </Box>
        </Container>
    )


}