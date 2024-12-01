import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GatewayService } from "./gateway.service";

@WebSocketGateway(3001, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
  namespace: '/'
})
export class GatewayController {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
  ) {}

  @SubscribeMessage('joinQuestion')
  handleJoinQuestion(
    @MessageBody() body: { questionId: string }, 
    @ConnectedSocket() socket: Socket
  ) {
    return this.gatewayService.handleJoinQuestion(body, socket) 
  }

  @SubscribeMessage('joinNotification')
  handleJoinNotification(
    @MessageBody() body: { userId: string }, 
    @ConnectedSocket() socket: Socket
  ) {
    return this.gatewayService.handleJoinNotification(body, socket) 
  }

  @SubscribeMessage('newQuestion')
  onNewQuestion(@MessageBody() body: any) {
    return this.gatewayService.onNewQuestion(this.server, body)
  }

  @SubscribeMessage('questionChanged')
  onNewAnswer(@MessageBody() body: { questionId: string }) {
    return this.gatewayService.onNewAnswer(this.server, body)
  }

  @SubscribeMessage('notificationChanged')
  onNotificationChanged(@MessageBody() body: { userId: string }) {
    return this.gatewayService.onNotificationChanged(this.server, body)
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(socket: Socket) {
    return this.gatewayService.handleDisconnect(socket)
  }
}