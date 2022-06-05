import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { WriteLoggerDto } from './dto/write-logger.dto';
import { LoggerService } from './logger.service';

@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Post('/setup')
  setup() {
    return this.loggerService.setup();
  }

  @Get('/read')
  read() {
    return this.loggerService.read();
  }

  @Patch('/write')
  update(@Body() writeLoggerDto: WriteLoggerDto) {
    return this.loggerService.write(writeLoggerDto);
  }
}
