import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { prisma } from '../prisma.js';
import { MetricsType } from '@prisma/client';

@Controller('/api/dashboard')
export class DashboardController {
  @Inject()
  ctx: Context;

  @Get('/unit_tests')
  async getUnitTests() {
    return await prisma.unitTest.findMany({
      orderBy: [{ id: 'desc' }],
      include: {
        Measure: true,
      },
    });
  }

  @Get('/measure')
  async measure(@Query('unitTestId') id) {
    const unitTestId = Number(id);
    return await prisma.measure.findFirst({
      where: {
        unitTestId,
      },
    });
  }

  @Get('/metrics')
  async metrics(@Query('unitTestId') id, @Query('type') type) {
    const unitTestId = Number(id);
    const metricsType = MetricsType[type];
    if (!metricsType) {
      return [];
    }
    return (
      await prisma.metrics.findMany({
        where: {
          type: metricsType,
          unitTestId,
        },
      })
    ).map(info => ({
      ...info,
      value: String(info.value),
    }));
  }
}
