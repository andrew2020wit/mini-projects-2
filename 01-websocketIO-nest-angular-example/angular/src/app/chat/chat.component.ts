import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messages = [{ type: 'system', value: 'It started' }];
  message = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.sendMessage('client-message', 'hello');
    this.chatService.getMessage('client-message').subscribe((x) => {
      console.log('getMessage', x);
      this.messages.push({ type: 'client-message', value: x });
    });
    this.chatService.getMessage('server-message').subscribe((x) => {
      console.log('getMessage', x);
      this.messages.push({ type: 'server-message', value: x });
    });
  }
  send(): void {
    this.chatService.sendMessage('client-message', this.message);
    this.message = '';
  }
}
