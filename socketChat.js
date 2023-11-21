import { Server } from "socket.io";
import MessageModel from "./dao/models/message.models.js";

let io;

export const initChat = (httpServer) => {
  io = new Server(httpServer);

  io.on("connection", async (socketClient) => {
    try {
      // Al conectar, obtén todos los mensajes y emite al cliente
      const messages = await MessageModel.find();

      socketClient.emit("conversation", messages);
    } catch (error) {
      console.log("Error al obtener mensajes:", error);
    }

    socketClient.on("new-message", async (newMessage) => {
      try {
        // Guardar el nuevo mensaje en la base de datos
        await MessageModel.create(newMessage);
        const menssages = await MessageModel.find({});
        // Emitir a todos los clientes conectados el nuevo mensaje
        io.emit("conversation", menssages);
      } catch (error) {
        console.error("Error al guardar el nuevo mensaje:", error);
      }
    });
  });
};
