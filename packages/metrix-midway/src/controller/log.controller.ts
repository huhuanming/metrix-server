import AdmZip from 'adm-zip';
import { Inject, Controller, Post, Files, Fields } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { prisma } from '../prisma.js';
import { Measure, MetricsType, StatisticsType } from '@prisma/client';
import { normalizedBitInt } from '../utils.js';

const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;
const PlaceholderDate = new Date(0).toISOString()

@Controller('/api/logs')
export class LogController {
  @Inject()
  ctx: Context;

  @Post('/upload')
  async upload(
    @Files() files,
    @Fields() fields: { unitTestName: string; password: string; extra: string }
  ) {
    if (fields.password !== UPLOAD_PASSWORD) {
      return { success: false, message: 'password is wrong' };
    }
    const { unitTestName, extra } = fields;
    setTimeout(async () => {
      const file = files[0];
      console.log(file, extra);
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
      let measureJSON: Measure;
      try {
        measureJSON = JSON.parse(extra);
      } catch (e) {
        console.error(e);
      }
      if (measureJSON) {
        await prisma.measure.create({
          data: {
            jsBundleLoadedTime: measureJSON.jsBundleLoadedTime || 0,
            jsBundleLoadedTimeAt: measureJSON.jsBundleLoadedTimeAt || PlaceholderDate,
            fpTime: measureJSON.fpTime || 0,
            fpTimeAt: measureJSON.fpTimeAt || PlaceholderDate,
            commitHash: measureJSON.commitHash || '',
            brand: measureJSON.brand || '',
            buildNumber: measureJSON.buildNumber,
            deviceId: measureJSON.deviceId || '',
            model: measureJSON.model || '',
            systemName: measureJSON.systemName || '',
            systemVersion: measureJSON.systemVersion || '',
            unitTestId: unitTest.id,
          },
        });
      }

      const metricsTypeKeys = Object.keys(MetricsType) as MetricsType[];
      const metricsInfoArray = [];
      metricsText.split('\n').forEach(line => {
        const [rawTime, rawMetricsInfo] = line.split('| INFO :');
        const runAt = rawTime.trim();
        try {
          const metricsInfo = JSON.parse(rawMetricsInfo);
          metricsTypeKeys.forEach(key => {
            metricsInfoArray.push({
              unitTestId: unitTest.id,
              runAt,
              type: MetricsType[key],
              value: normalizedBitInt(metricsInfo[key] * 1000),
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

      const metricsStatisticsArray = [];
      for (let index = 0; index < metricsTypeKeys.length; index++) {
        const key = metricsTypeKeys[index];
        const avg = await prisma.metrics.aggregate({
          _max: {
            value: true,
          },
          _avg: {
            value: true,
          },
          _min: {
            value: true,
          },
          where: {
            unitTestId: unitTest.id,
            type: key,
          },
        });
        metricsStatisticsArray.push({
          type: key,
          statistics: StatisticsType.avg,
          unitTestId: unitTest.id,
          value: normalizedBitInt(avg._avg.value),
        });
        metricsStatisticsArray.push({
          type: key,
          statistics: StatisticsType.max,
          unitTestId: unitTest.id,
          value: normalizedBitInt(avg._max.value),
        });
        metricsStatisticsArray.push({
          type: key,
          statistics: StatisticsType.min,
          unitTestId: unitTest.id,
          value: normalizedBitInt(avg._min.value),
        });
      }
      await prisma.metricsStatistics.createMany({
        data: metricsStatisticsArray,
      });
    });
    return { success: true };
  }
}
