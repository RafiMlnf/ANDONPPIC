import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinesModule } from './lines/lines.module';

@Module({
  imports: [LinesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
