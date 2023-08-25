import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1692696664797_6006',
  koa: {
    port: 7001,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'NJR6nnn0uhn1qzp2fat',
    expiresIn: '2d', // https://github.com/vercel/ms
  },
} as MidwayConfig;
