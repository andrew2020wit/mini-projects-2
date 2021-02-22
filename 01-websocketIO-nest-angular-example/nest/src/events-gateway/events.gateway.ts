import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('client-message')
  async identity(@MessageBody() data: string) {
    console.log('client-message: ', data);
    this.server.emit('client-message', data);
    this.server.emit('server-message', 'test');
  }
}
