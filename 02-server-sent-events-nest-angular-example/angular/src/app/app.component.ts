import { Component, OnInit } from '@angular/core';
import { SseService } from './sse.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private sseService: SseService) {}
  ngOnInit() {
    this.sseService
      .getServerSentEvent('http://localhost:3000/sse')
      .subscribe((data) => console.log(data));
  }
}
