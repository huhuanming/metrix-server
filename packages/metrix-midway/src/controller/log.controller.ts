import AdmZip from 'adm-zip';
import { Inject, Controller, Post, Files, Fields } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { prisma } from '../prisma.js';

@Controller('/logs')
export class LogController {
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
      const metricsText = zipEntry.getData().toString('utf8');
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
      metricsText.split('\n').forEach(line => {
        console.log(line);
        // console.log(line.split('| INFO :'));
      });
      //   let metricsJSON: {
      //     usedCpu: number;
      //     jsFps: number;
      //     usedRam: number;
      //     uiFps: number;
      //   }[];
      //   try {
      //     metricsJSON = JSON.parse(metricsText);
      //   } catch (e) {
      //     console.error(e);
      //   }
      //   console.log(metricsJSON);
    });
    return { success: true };
  }
}
