import {
  Inject,
  Controller,
  Get,
  Query,
  Body,
  Del,
  Post,
} from '@midwayjs/core';
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
        MetricsStatistics: true,
      },
    });
  }

  @Post('/unit_test')
  async getUnitTestsByIds(@Body('unitTestIds') ids) {
    ids = ids.slice(0, 100);
    return await prisma.unitTest.findMany({
      include: {
        Measure: true,
        MetricsStatistics: true,
      },
      where: {
        id: { in: ids.map((i: string) => Number(i)) },
      },
    });
  }

  @Del('/unit_tests')
  async deleteUnitTestsByid(@Query('unitTestId') id) {
    // return await prisma.unitTest.delete({
    //   where: {
    //     id: Number(id),
    //   },
    // });
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
    return await prisma.metrics.findMany({
      where: {
        type: metricsType,
        unitTestId,
      },
    });
  }

  @Get('/upload-password')
  async getUploadPassword() {
    return { password: process.env.UPLOAD_PASSWORD };
  }
}
