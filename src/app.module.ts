import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppGateway } from './app.gateway';
import { ormConfig } from './config';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   useFactory: async () =>
    //     Object.assign(await getConnectionOptions(), { autoLoadEntities: true }),
    // }),
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    AuthModule,
    CategoryModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
