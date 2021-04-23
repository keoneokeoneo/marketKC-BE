import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  //app.useWebSocketAdapter(new SocketIoAdapter(app, corsOrigins));
}
bootstrap();
