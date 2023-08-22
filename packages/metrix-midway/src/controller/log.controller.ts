import AdmZip from 'adm-zip';
import { Inject, Controller, Post, Files, Fields } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { prisma } from '../prisma.js';
import { MetricsType } from '@prisma/client';

@Controller('/api/logs')
export class LogController {
  @Inject()
  ctx: Context;

  @Post('/upload')
  async get() {}
}
