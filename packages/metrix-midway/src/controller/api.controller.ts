import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { prisma } from '../prisma.js';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  jwtService: JwtService;

  @Post('/login')
  async loginUser(@Body('username') username, @Body('password') password) {
    const user = await prisma.user.findUnique({
      where: {
        username,
        password,
      },
    });
    if (!user) {
      return { message: 'The username or password is incorrect' };
    }
    const token = await this.jwtService.sign({ username });
    this.ctx.cookies.set('token', token, {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });
    return { success: true };
  }
}
