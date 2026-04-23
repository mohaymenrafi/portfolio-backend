import { All, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from '../lib/auth';
import { toNodeHandler } from 'better-auth/node';
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

const handler = toNodeHandler(auth);

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Post('sign-up/email')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', example: 'Rafi' },
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'securepassword' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  @ApiResponse({ status: 422, description: 'Email already in use' })
  signUp(@Req() req: Request, @Res() res: Response) {
    return handler(req, res);
  }

  @Post('sign-in/email')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'securepassword' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Returns session token and user object' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signIn(@Req() req: Request, @Res() res: Response) {
    return handler(req, res);
  }

  @Post('sign-out')
  @ApiOperation({ summary: 'Sign out (invalidates session)' })
  @ApiResponse({ status: 200, description: 'Signed out successfully' })
  signOut(@Req() req: Request, @Res() res: Response) {
    return handler(req, res);
  }

  @All('*path')
  @ApiExcludeEndpoint()
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return handler(req, res);
  }
}
