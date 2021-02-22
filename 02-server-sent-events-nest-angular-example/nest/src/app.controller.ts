import { Controller, Get, Sse } from '@nestjs/common';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller()
export class AppController {
  @Get('hello')
  getHello(): string {
    return 'hello';
  }

  @Sse('sse')
  sse(): Observable<string> {
    return interval(1000).pipe(map((x) => 'test ' + x));
  }
}
