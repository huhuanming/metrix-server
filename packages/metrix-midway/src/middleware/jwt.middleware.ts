import { Inject, httpError } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';

import type { Context, NextFunction } from '@midwayjs/koa';
import { prisma } from '../prisma.js';

@Middleware()
export class JwtMiddleware {
  @Inject()
  jwtService: JwtService;

  public static getName(): string {
    return 'jwt';
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const token = ctx.cookies.get('token');
      if (!token) {
        throw new httpError.UnauthorizedError();
      }
      const result = await this.jwtService.verify(token, {
        complete: true,
      });
      if (typeof result !== 'object') {
        throw new httpError.UnauthorizedError();
      }
      const user = prisma.user.findUnique({
        where: {
          username: (result.payload as { username: string }).username,
        },
      });
      if (!user) {
        throw new httpError.UnauthorizedError();
      }
      await next();
    };
  }
}
