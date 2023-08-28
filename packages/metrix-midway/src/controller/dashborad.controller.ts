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
import { JwtMiddleware } from '../middleware/jwt.middleware.js';

@Controller('/api/dashboard', { middleware: [JwtMiddleware] })
export class DashboardController {
  @Inject()
  ctx: Context;

  @Get('/unit_tests')
  async getUnitTests(
    @Query('pageSize') pageSize,
    @Query('pageIndex') pageIndex,
    @Query('name') name,
    @Query('deviceId') deviceId,
    @Query('model') model
  ) {
    const result = await prisma.unitTest.findMany({
      orderBy: [{ id: 'desc' }],
      skip: (Number(pageIndex) - 1) * Number(pageSize),
      take: Number(pageSize),
      where: {
        name: { equals: name },
        Measure: {
          deviceId: { equals: deviceId },
          model: { equals: model },
        },
      },
      include: {
        Measure: true,
        MetricsStatistics: true,
      },
    });
    return {
      pageIndex: pageIndex + 1,
      totalSize: await prisma.unitTest.count(),
      data: result,
    };
  }

  @Get('/unit_test_names')
  async getUnitTestNames() {
    return await prisma.unitTest.groupBy({
      by: ['name'],
    });
  }

  @Get('/deviceId')
  async getDeviceIds() {
    return await prisma.measure.groupBy({
      by: ['deviceId'],
    });
  }

  @Get('/models')
  async getModel() {
    return await prisma.measure.groupBy({
      by: ['model'],
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

  @Post('/unit_test_by_name')
  async getUnitTestsByName(@Body('name') name) {
    return await prisma.unitTest.findMany({
      include: {
        Measure: true,
        MetricsStatistics: true,
      },
      where: {
        name,
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

  @Post('/metrics')
  async metrics(@Body('unitTestIds') ids, @Body('type') type) {
    const metricsType = MetricsType[type];
    if (!metricsType) {
      return [];
    }
    return await prisma.metrics.findMany({
      where: {
        type: metricsType,
        unitTestId: { in: ids.map((i: string) => Number(i)) },
      },
    });
  }

  @Get('/upload-password')
  async getUploadPassword() {
    return { password: process.env.UPLOAD_PASSWORD };
  }
}
