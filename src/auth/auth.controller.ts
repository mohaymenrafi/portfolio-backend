import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from '../lib/auth';
import { toNodeHandler } from 'better-auth/node';

const handler = toNodeHandler(auth);

@Controller('auth')
export class AuthController {
  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return handler(req, res);
  }
}
