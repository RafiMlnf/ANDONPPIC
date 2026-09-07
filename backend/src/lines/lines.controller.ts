import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { LinesService } from './lines.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { LineCard } from './line.entity';

@Controller('api/lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @Get()
  findAll(): LineCard[] {
    return this.linesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): LineCard {
    return this.linesService.findOne(id);
  }

  @Post()
  create(@Body() createLineDto: CreateLineDto): LineCard {
    return this.linesService.create(createLineDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLineDto: UpdateLineDto,
  ): LineCard {
    return this.linesService.update(id, updateLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linesService.remove(id);
  }

  @Post('reset')
  resetToDefault(): LineCard[] {
    return this.linesService.resetToDefault();
  }
}
