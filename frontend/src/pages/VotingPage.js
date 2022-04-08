import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import "./popstyle.css";
import logo from "../img/bp-logo.png";
import myStyle from "../css/myStyle.css";
import Popup from 'reactjs-popup';
import jwt_decode from "jwt-decode";
import axios from "axios";
import { ROOM_ID, DEFAULT_STORY_ID } from "../constant"
import { Box, Button, TextField, FormControl } from '@mui/material';

// import { ExitToAppIcon, ExpandMoreIcon } from '@mui/icons-material';
// import Chip from '@mui/material/Chip';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

function VotingPage() {
    const [reveal, setreveal] = React.useState(false);
    const generateUsername = require('generate-username-from-email');
    const votingNo = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?'];
    const [dialog, setdialog] = useState(localStorage.getItem("email") ? false : true);
    const navigate = useNavigate();
    const params = useParams();
    // const storyId = params.storyId;
    const storyId = localStorage.getItem("story");
    // console.log("story id is:", storyId);

    const [story, SetStory] = useState([])
    const [storyInfo, SetStoryInfo] = useState({});

    const [users, SetUsers] = useState();
    const [display, SetDisplay] = useState();
    const [newemail, setnewemail] = useState("");
    const [vote, SetVote] = useState(null);

    const handledialog = () => {
        setdialog(false)

    }

    const handlenewlogin = (e) => {

        // e.preventDefault();
        axios
            .post("http://localhost:5000/api/v1/auth/login", {
                email: newemail,
            }).then(res => {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("email", newemail)
                localStorage.setItem("story", DEFAULT_STORY_ID)
                setdialog(false)
            }
            )
            .catch((err) => console.log(err));
    }


    // const {roomId} =useParams()
    const roomId = params.roomId;
    React.useEffect(() => {
        // console.log(localStorage.getItem("isAdmin"))
        // if (localStorage.getItem("email")) {
            console.log("room creation API")

            axios
                .post(`http://localhost:5000/api/room/${roomId}`, {
                    email: localStorage.getItem("email")
                })
                .then((res) => {
                    // console.log(res.data.revote);
                    console.log(res.data)
                })
                .catch((err) => console.log(err));
            
    }, []);

    //display login users
    useEffect(() => {
        axios.get(`http://localhost:5000/users/${roomId}`)
            .then((res) => {

                SetDisplay(res.data.data)
                console.log("login details:", res.data.data)
            })
            .catch((err) => console.log(err));
    })
 

    const handleCopy = () => {
        let text = document.getElementById("mybox");
        text.select();
        navigator.clipboard.writeText(text.value);
        document.getSelection().removeAllRanges();
        alert("linked copied!!")
    };

    const handleLogout = () => {
        console.log("logout working")
        window.localStorage.clear();
        navigate("/");
    }

    const getStory = () => {
        axios.get(`http://localhost:5000/api/v1/story/${storyId}`).then((res) => {
            const data = res?.data.data
            SetStoryInfo(res?.data.data)
            // SetStory(res?.data.data)
            // console.log(res.data.data)
        }).catch((err) => {

        })
    }

    useEffect(() => {
        getStory()
    }, [storyId])

    const token = localStorage.getItem("token");

    if (token === null) {
        // window.location.replace("/");
    } else {
        var decoded = jwt_decode(token);
        const { user } = decoded;
        localStorage.setItem("isAdmin", user.isAdmin);
        localStorage.setItem("email", user.email);
        localStorage.setItem("id", user.id);
    }
    const handleSubmitVote = () => {
        if (vote !== null) {
            axios
                .patch(
                    "http://localhost:5000/api/v1/vote",//storing all info in vote database
                    {
                        email: localStorage.getItem("email"),
                        user: localStorage.getItem("id"),
                        story: storyInfo.story[0],
                        vote: vote,
                        roomId: roomId,
                    },
                    {
                        headers: {
                            token: token,
                        },
                    }
                )
                .then(function (response) {
                    // handle success
                    // console.log(response);
                    // navigate("/Result", { state: { storyId } });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }


    const [data, setData] = useState([])
    const getResults = () => {
        axios.get(`http://localhost:5000/api/v1/results/vote/${roomId}`).then((res) => {
            // console.log("result", res)
            setData(res?.data.data)
            // for (let vote in data) {
            //     // console.log(vote + ": " + data[vote])
            // }

            setreveal(res.data.data[0].status)
           
        }).catch((err) => {
            // console.log("get result error.......", err)
            setreveal(false)
        })
    }
    useEffect(() => {
        getResults()
        const interval = setInterval(() => getResults(), 4000)
        return () => {
            clearInterval(interval);
        }

    }, [])


    const handleReveal = () => {
        // console.log("handle reveal function strated")
        axios.get(`http://localhost:5000/api/reveal/${roomId}`).then((res) => {
            // if (roomId === res.data.data[0].roomId) {
            setreveal(true);
            // }
        })
    }

    //Deletion

    const handle = () => {
        // console.log("data is not cleared")

        axios.delete(`http://localhost:5000/api/v1/vote/clear/${roomId}`)
            .then((res) => {
                // console.log("start new votes clicked", res)

                if (res.data.success) {
                    setreveal(false)
                }
            })
    }

    //revote state
    const [revote, setRevote] = useState(null);
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/revote/")
            .then((res) => {
                // console.log(res.data.revote);
                setRevote(res.data.revote);
            })
            .catch((err) => console.log(err));
    }, []);

    // console.log(typeof revote);

    const location = useLocation();
    // console.log(location.state.storyId);


    const isAdmin = localStorage.getItem("isAdmin");

    const array = [];
    //count 
    {
        data.length > 0 && data.map((key, index) => { array.push(key?.vote) })
    }
    const a = array;
    let counts = {}
    let countArray = []
    let pcard = []
    let countArrayCard = []
    let prop = 0;


    function count_duplicate(a) {

        ///count
        for (let i = 0; i < a.length; i++) {
            if (counts[a[i]]) {
                counts[a[i]] += 1
            } else {
                counts[a[i]] = 1
            }
        }
        for (let prop in counts) {
            if (counts[prop] >= 1) {
            }
            // countArray.push(prop + " counted: " + counts[prop] + " times.")
            countArrayCard.push(prop, counts[prop])
            countArray.push(counts[prop])
            pcard.push(prop)
        }
        // console.log(counts)
    }

    count_duplicate(a)
    
    function calculateAverage(array) {
        var total = 0;
        var count = 0;

        array.forEach(function (item, index) {
            total += item;
            count++;
        });
        
        return (total / count).toFixed(2);
    }

    //open sidenavbar

    useEffect(() => {
        if (data.length > 0) {
            // const isReveal = data[0].status
            if (reveal) {
                document.getElementById("mySidenav").style.width = "600px";
            }
        }
    }, [data])

    // closeNavbar
    useEffect(() => {
        if (data.length === 0) {
            document.getElementById("mySidenav").style.width = "0";
        }
    }, [data])

    // useEffect(() => {
    //     return () => {
    //         window.addEventListener("beforeunload",
    //             function (e) {
    //                 localStorage.clear()
    //             });
    //     }
    // });

    return (
        <div>
            <head>
                <title>PLANNING POKER</title>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Merriweather|Open+Sans"

                />
                <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            </head>
            <body>
                <div class="navbar">
                    <div className="header-left">
                        <h2 className="header4">&spades; Planning Poker</h2>
                    </div>
                    <div className="header-middle">
                        <h5 className="header5">Story : <label>{storyInfo?.story}</label></h5>
                    </div>
                    <div className="useremail">

                        <Button variant="outlined" size="large" style={{ textTransform: 'none' }}>{localStorage.getItem("email")}</Button>
                        {/* <label>
                            <h3 className="header5">{localStorage.getItem("email")}</h3>
                        </label> */}

                    </div>
                    <div className="logoutuser">
                        <Button variant="contained" size="large" onClick={() => handleLogout()} style={{ backgroundColor: ' #008CBA', textTransform: 'none' }}>Logout</Button>
                    </div>
                    

                    <div className="invite">
                        {<Popup
                            trigger={isAdmin === "false" ? <label></label> : <Button variant="contained" size="large" style={{ backgroundColor: ' #008CBA', textTransform: 'none' }}>Invite Link</Button>}
                            modal
                            nested
                        >
                            {close => (
                                <div className="">
                                    <Box
                                        component="form"
                                        sx={{
                                            '& .MuiTextField-root': { m: 1, width: '50ch', hight: '40ch' },
                                        }}
                                        className="inform"
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <h3> <center>Invite Players</center></h3>
                                        <button className="close" onClick={close}>
                                            &times;
                                        </button>

                                        <div>
                                            <TextField id="mybox"
                                                label="Game Room Id"
                                                value={roomId}
                                                fullWidth
                                                variant="outlined" />
                                        </div>
                                        <div>
                                            <FormControl sx={{ m: 1, width: '50ch' }} variant="filled">
                                                <Button variant="contained"
                                                    fullWidth size="large"
                                                    style={{ textTransform: 'none' }}
                                                    value={window.location.href}
                                                    placeholder='https://plan-it-poker.netlify.app/room/{}'
                                                    onClick={() => {
                                                        handleCopy();
                                                        close();
                                                    }}>
                                                    Copy
                                                </Button>
                                            </FormControl>
                                        </div>
                                        <div>
                                            <br />
                                        </div>
                                    </Box>
                                </div>
                            )}
                        </Popup>}
                    </div>


                </div>

                <div className="room-module">

                    <div className="card-module">
                        <div className="cards ">

                            <div className="wrapper">


                                {
                                    votingNo.length > 0 && votingNo.map((key) => {
                                      
                                        const isSelected = (key == vote) ? true : false
                                        return (
                                            <button
                                                id={key}
                                                className={`button3 btn3 ${isSelected ? "blue" : "black"}`}
                                                onClick={() => {
                                                    SetVote(key);//handleSubmitVote(); 
                                                }
                                                }//setting the state for vote
                                            >
                                                {key}
                                            </button>
                                        )
                                    })
                                }

                            </div>
                        </div>

                        <div className="result-module">
                            <div className="gridVoting">
                                {display?.Users.map(user => {
                                    // console.log(user)
                                    return (
                                        <div class="resultgrid1">

                                            <button
                                                id={user}
                                                className={`button3 btn3`}
                                            >
                                                {
                                                    data.length > 0 && data.map((key, index) => {
                                                        console.log("data:",key.user,user._id,String(user._id)===String(key.user))
                                                        if(String(user._id)===String(key.user)){
                                                        return (
                                                            
                                                            <> {key.status ? key?.vote :
                                                                //  <label className="spades">&spades;</label>
                                                                <img src={require('../img/bp-logo.png')} />
                                                                 }</>

                                                        )}
                                                        else{
                                                            return null
                                                        }
                                                    })
                                                }
                                            </button>

                                            {generateUsername(user.email)}
                                            <br></br>
                                        </div>
                                    )
                                })}
                                <br />
                            </div>
                        </div>
                        <div className="cardbtn">
                            <Button variant="contained"
                                fullWidth size="large" onClick={() => handleSubmitVote()}
                                style={{ backgroundColor: '#AF7AC5', textTransform: 'none' }}>
                                Submit
                            </Button>

                        </div>
                        <div className="adminButton">
                            {isAdmin === "false" ? <label></label> :
                                <Button variant="contained"
                                    size="large" onClick={() => handle()} style={{ backgroundColor:  '#17202A', textTransform: 'none' }}>
                                    Start New Voting
                                </Button>} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            
                            {isAdmin === "false" ? <span></span> :
                                <Button variant="contained"
                                    size="large" onClick={() => handleReveal()} style={{ backgroundColor: '#2E86C1' , textTransform: 'none' }}>
                                    Reveal Cards
                                </Button>}
                            
                        </div>

                        <div id="mySidenav" className="sidenav">
                            <div className="Resultshow">
                               
                                <div className="res">
                                    <label><b>Average:</b>
                                        <h4 className="avg">{`${calculateAverage(array)}`}</h4>
                                    </label>
                                </div>
                                <br></br>
                                <div className="res2">
                                    <label><b>Lowest:</b>
                                        <h4 className="low">{Math.min(...array)}</h4>
                                    </label>

                                    <label><b>Highest:</b>
                                        <h4 className="high">{Math.max(...array)}</h4>
                                    </label>
                                </div>
                                <div className="gridVote">
                                    <div className="votings">

                                        <div className="countgrid">
                                            {
                                                pcard.map((items) => {
                                                    return (
                                                        <button className="b b2">{items}</button>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="countname">
                                            {
                                                countArray.map((items) => {
                                                    return (
                                                        (items > 1) ? <label>{items} Votes</label> : <label>{items} Vote</label>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog 
                open={dialog} 
               
                sx={{
                    '& .MuiTextField-root': {m:2, width: '50ch',hight:'40ch' },
                }}
                >
                    <form  
                     className="user-form"
                        onSubmit={(e) => handlenewlogin(e)}
                     >
                         <center><DialogTitle><h4>Join The Room</h4></DialogTitle> </center>
                        <DialogContent
                          className="user-form">

                            {/* <DialogContentText>
                                please enter your email address here.

                            </DialogContentText> */}
                            <TextField
                                id="outlined-basic"
                                label="Email Id"
                                variant="outlined"
                                autoFocus
                                type="email"
                                fullWidth
                                value={newemail}
                                onChange={(e) => setnewemail(e.target.value)}
                            />
                        
                        <DialogActions sx={{ m:1,width: '52ch' }}  variant="filled">
                            
                                <Button variant="contained" type="submit" fullWidth size="large" style={{ textTransform: 'none' }} >Join Room</Button>
                            
                        </DialogActions>
                        </DialogContent>
                    </form>
                </Dialog>
            </body>

        </div >

    );
}

export default VotingPage;