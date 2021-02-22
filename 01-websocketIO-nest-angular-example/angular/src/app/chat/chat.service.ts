import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  sendMessage(msgType: string, msg: string): void {
    this.socket.emit(msgType, msg);
  }
  getMessage(msgType: string): Observable<string> {
    return this.socket.fromEvent(msgType);
  }
}
