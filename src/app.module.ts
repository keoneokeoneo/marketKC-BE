import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { AppGateway } from './app.gateway';
import * as ormconfig from './ormconfig';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   useFactory: async () =>
    //     Object.assign(await getConnectionOptions(), { autoLoadEntities: true }),
    // }),
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
