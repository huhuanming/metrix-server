import AdmZip from 'adm-zip';
import { Inject, Controller, Post, Files, Fields } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { prisma } from '../prisma.js';
import { MetricsType, Prisma } from '@prisma/client';

@Controller('/api/dashboard')
export class DashboardController {
  @Inject()
  ctx: Context;

  @Post('/upload')
  async upload(
    @Files() files,
    @Fields() fields: { unitTestName: string; password: string; extra: string }
  ) {
    const { unitTestName, password, extra } = fields;
    // if (password !== '') {
    //   return { success: false, message: 'password is wrong' };
    // }
    setTimeout(async () => {
      const file = files[0];
      const zip = new AdmZip(file.data);
      const zipEntries = zip.getEntries();
      const zipEntry = zipEntries.find(zipEntry => {
        return zipEntry.entryName === 'metrix.log';
      });
      const metricsText = zipEntry.getData().toString('utf8').trim();
      const unitTest = await prisma.unitTest.create({
        data: {
          name: unitTestName,
        },
      });
      let measureJSON: {
        jsBundleLoadedTime: number;
        fpTime: number;
        batteryUsed: number;
      };
      try {
        measureJSON = JSON.parse(extra);
      } catch (e) {
        console.error(e);
      }
      if (measureJSON) {
        await prisma.measure.create({
          data: {
            jsBundleLoadedTime: measureJSON.jsBundleLoadedTime,
            fpTime: measureJSON.fpTime,
            unitTestId: unitTest.id,
          },
        });
      }

      const keys = Object.keys(MetricsType);
      const metricsInfoArray = [];
      metricsText.split('\n').forEach(line => {
        const [rawTime, rawMetricsInfo] = line.split('| INFO :');
        const runAt = rawTime.trim();
        try {
          const metricsInfo = JSON.parse(rawMetricsInfo);
          keys.forEach(key => {
            metricsInfoArray.push({
              unitTestId: unitTest.id,
              runAt,
              type: MetricsType[key],
              value: BigInt(metricsInfo[key] * 1000),
            });
          });
        } catch (error) {
          console.error(error);
        }
      });
      await prisma.metrics.createMany({
        data: metricsInfoArray,
        skipDuplicates: true,
      });
    });
    return { success: true };
  }
}
