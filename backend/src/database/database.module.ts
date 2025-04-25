import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from '../tasks/entities/tasks.entity';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT ?? '3306'),
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        synchronize: true,
        autoLoadModels: true,
        models: [User, Task],
        logging: process.env.NODE_ENV !== 'test',
      }),
    }),
  ],
})
export class DatabaseModule {}
