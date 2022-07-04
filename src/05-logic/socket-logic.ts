import { Server as HttpServer } from "http";
import { Server as SocketIoServer, Socket } from "socket.io";


function socketLogic(httpServer: HttpServer): void {

   
    const socketIoServer = new SocketIoServer(httpServer, { cors: { origin: "http://localhost:3000" } });

   

   
    socketIoServer.sockets.on("connection", async (socket: Socket) => {

        console.log("Client has been connected");

       
        socket.on("msg-from-client-add", async (addedVacation :any) => {

            console.log("Client sent message: ", addedVacation);

         
            
            
            socketIoServer.sockets.emit<any>("msg-from-server-add", addedVacation);
        });

        socket.on("msg-from-client-update", async (updatedVacation :any) => {

            
            socketIoServer.sockets.emit<any>("msg-from-server-update", updatedVacation);
        });

        socket.on("msg-from-client-delete", async (deleteVacation :any) => {

            socketIoServer.sockets.emit<any>("msg-from-server-delete", deleteVacation);
        });

       
        socket.on("disconnect", () => {
            console.log("Client has been disconnect");
        });

    });

}

export default socketLogic;