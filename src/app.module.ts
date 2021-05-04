import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { AppGateway } from './app.gateway';
import { ormConfig } from './config';
import { AppService } from './app.service';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   useFactory: async () =>
    //     Object.assign(await getConnectionOptions(), { autoLoadEntities: true }),
    // }),
    TypeOrmModule.forRoot(ormConfig),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppGateway, AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
