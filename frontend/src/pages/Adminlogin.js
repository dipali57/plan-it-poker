import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import axios from "axios";
import { DEFAULT_STORY_ID } from "../constant";
import { Box, Button, TextField, FormControl } from '@mui/material';
import myStyle from "../css/myStyle.css";

function Adminlogin() {
    const [email, setEmail] = useState("");
    const [error, serError] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    if (token != null) {
        // window.location.replace("/vote");
        window.location.replace("/room");
    }
    // const roomId = "623b0c220b1ec9102241878a"
    const handleRoom = (e) => {
        axios
            .post("http://localhost:5000/api/createroom", {
                email: email,
            })
            .then(function (response) {
                console.log(response)
                console.log(response.data.data._id)
                const rId = response.data.data._id;

                navigate("/room/" + rId);
            })
    }
  
    const handleSubmit = (e) => {
        // e.preventDefault();
        axios
            .post("http://localhost:5000/api/v1/auth/login", {
                email: email,
            })
           
            .then(function (response) {
                console.log(response)
                let token = response.data.token;
                localStorage.setItem("token", token);
                localStorage.setItem("story", DEFAULT_STORY_ID);
                // navigate("/vote/" + DEFAULT_STORY_ID);
                // console.log(response)
                handleRoom()
            })
            .catch(function (error) {
                console.log(error);
                serError(true);
            });
    };
    const handlePage =() =>{
        navigate("/user")
    }
    return (
        <div>
             <div>
            <h2><center>Planning Poker </center></h2>
            <div className="loginUser">
            <Button
                variant="contained"
                onClick={() => handlePage()}>
                User Login
            </Button>
            </div>
            </div>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '50ch', hight: '40ch' },
                }}
                className="room-form"
                noValidate
                autoComplete="off"
            >
                <center>
                    <h4>Create Room</h4>
                    <div>
                        <TextField id="outlined-basic"
                            label="Email Id"
                            value={email}
                            fullWidth
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined" />
                    </div>
                    <div>
                        <TextField id="outlined-basic"
                            label="Game Name"
                            fullWidth
                            variant="outlined" />
                    </div>
                    <FormControl sx={{ m: 1, width: '50ch' }} variant="filled">
                        <Button variant="contained"
                            fullWidth size="large" onClick={() => handleSubmit()} style={{ textTransform: 'none' }}>Create Room</Button>

                        <br />
                        {error ? "Enter valid email id" : ""}
                    </FormControl>
                </center>
            </Box>
        </div>
    );
}

export default Adminlogin;
