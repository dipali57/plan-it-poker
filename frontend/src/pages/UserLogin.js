import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import axios from "axios";
import { ROOM_ID, DEFAULT_STORY_ID } from "../constant";
import {Box,Button,TextField,FormControl} from '@mui/material';

function UserLogin() {
    const [email, setEmail] = useState("");
    const [RoomId, setRoomId] = useState("");
    const [error, serError] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    if (token != null) {
        // window.location.replace("/vote");
        window.location.replace("/room");
    }
    const roomId = "623b0c220b1ec9102241878a"
    const handleSubmit = (e) => {
        // e.preventDefault();
        axios
            .post("https://plan-it-poker-webapp.herokuapp.com/api/v1/auth/login", {
                email: email,
            })
            .then(function (response) {
                let token = response.data.token;
                localStorage.setItem("token", token);
                localStorage.setItem("story", DEFAULT_STORY_ID);
                // navigate("/vote/" + DEFAULT_STORY_ID);
                navigate("/room/" + RoomId);
                // navigate(`/room/${roomId}`)
            })
            .catch(function (error) {
                console.log(error);
                serError(true);
            });
    };
    const handlePage =() =>{
        navigate("/")
    }
    return (
        <div>
            <div>
            <h2><center>Planning Poker </center></h2>
            <div className="CreateUser">
            <Button
                variant="contained"
                onClick={() => handlePage()}>
                Create Room
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
                    <h4>Join The Room</h4>
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
                            label="Room Id"
                            placeholder={RoomId}
                            value={RoomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            fullWidth
                            variant="outlined" />
                    </div>
                    <FormControl sx={{ m: 1, width: '50ch' }} variant="filled">
                        <Button variant="contained"
                            fullWidth size="large"
                            style={{ textTransform: 'none' }}
                            onClick={() => { handleSubmit(); }}>
                            Join Room
                        </Button>

                        <br />
                        {error ? "Enter valid email id" : ""}
                    </FormControl>
                </center>
            </Box>

        </div>
    );
}

export default UserLogin;
