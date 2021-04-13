import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mysql',
  host: 'market-kc-db.ch0t1vd4iruk.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  username: 'keonho',
  password: 'Keonho1996^^',
  database: 'market-kc',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export = config;
