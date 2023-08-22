import AdmZip from 'adm-zip';
import { Inject, Controller, Post, Files, Fields } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

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
    setTimeout(() => {
      const file = files[0];
      const zip = new AdmZip(file.data);
      const zipEntries = zip.getEntries();
      const zipEntry = zipEntries.find(zipEntry => {
        return zipEntry.entryName === 'metrix.log';
      });
      const metricsText = zipEntry.getData().toString('utf8');
      console.log(metricsText, unitTestName, password, extra);
    });
    return { success: true };
  }
}
