import {Server} from "socket.io"
import http from "http"


const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        methods:["GET","POST"],
    }
});

io.on("connection" ,(socket)=>
{
    console.log("a user is connected",socket.id);

    socket.on("disconnect",()=>
    {
        console.log("user disconnect",socket.id);
    })
});
