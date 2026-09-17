import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CalculatorService } from './calculator.service';
import { EstimateDto } from './dto/estimate.dto';

@ApiTags('calculator')
@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Public()
  @Get('options')
  @ApiOperation({ summary: 'Crop types, soil types and served governorates' })
  options() {
    return this.calculatorService.options();
  }

  @Public()
  @Post('estimate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Preliminary compost requirement for a farm' })
  estimate(@Body() dto: EstimateDto) {
    return this.calculatorService.estimate(dto);
  }
}
