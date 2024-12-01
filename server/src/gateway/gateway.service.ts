import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@Injectable()
export class GatewayService {
  private questionSockets: Map<string, Set<string>> = new Map();
  private notificationSockets: Map<string, Set<string>> = new Map();

  handleJoinQuestion(body: { questionId: string }, socket: Socket) {
    const { questionId } = body;

    if (!this.questionSockets.has(questionId)) {
      this.questionSockets.set(questionId, new Set());
    }
    this.questionSockets.get(questionId).add(socket.id);  
  }

  handleJoinNotification(body: { userId: string }, socket: Socket) {
    const { userId } = body;

    if (!this.notificationSockets.has(userId)) {
      this.notificationSockets.set(userId, new Set());
    }
    this.notificationSockets.get(userId).add(socket.id);  
  }

  onNewQuestion(server: Server, body: any) {
    server.emit('newQuestion', { data: body });
  }

  onNewAnswer(server: Server, body: { questionId: string }) {
    const sockets = this.questionSockets.get(body.questionId);

    if (sockets) {
      sockets.forEach(socketId => {
        server.to(socketId).emit('questionChanged', { data: body }); 
      });
    }  
  }

  onNotificationChanged(server: Server, body: { userId: string }) {
    const sockets = this.notificationSockets.get(body.userId);

    if (sockets) {
      sockets.forEach(socketId => {
        server.to(socketId).emit('notificationChanged', { data: body }); 
      });
    }  
  }

  handleDisconnect(socket: Socket) {
    this.questionSockets.forEach((sockets, questionId) => {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        this.questionSockets.delete(questionId); 
      }
    });  
    this.notificationSockets.forEach((sockets, userId) => {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        this.notificationSockets.delete(userId); 
      }
    });  
  }
}