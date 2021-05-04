import { ConnectionOptions } from 'typeorm';

export const ormConfig: ConnectionOptions = {
  type: 'mysql',
  host: 'market-kc-db.ch0t1vd4iruk.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  username: 'keonho',
  password: 'Keonho1996^^',
  database: 'market-kc',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export const JWT_SECRET_KEY = 'market-kc-secret-key';

export const S3_BASE_URL =
  'https://market-kc-bucket.s3.ap-northeast-2.amazonaws.com';
