import { Module } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './entities/tasks.entity';
import { UserModule } from '../users/users.module';
// import { UserModule } from '../user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Task]), UserModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
