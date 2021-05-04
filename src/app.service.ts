import { Injectable } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private connection: Connection) {}

  async fetchCategories() {
    const categories = await getConnection().createQueryBuilder().getMany();
    console.log(categories);

    return categories;
  }
}
