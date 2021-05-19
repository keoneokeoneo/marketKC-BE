import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppGateway } from './app.gateway';
import { ormConfig } from './config';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    AuthModule,
    CategoryModule,
    PostModule,
    ChatModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
