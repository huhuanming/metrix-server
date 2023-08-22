import { Inject, Controller, Get, Files, Fields } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { prisma } from '../prisma.js';
import { MetricsType, Prisma } from '@prisma/client';

@Controller('/api/dashboard')
export class DashboardController {
  @Inject()
  ctx: Context;

  @Get('/upload')
  async measure(
  ) {
}
