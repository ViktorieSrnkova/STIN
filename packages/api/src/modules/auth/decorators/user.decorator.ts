import { createParamDecorator } from '@nestjs/common';
import get from 'lodash/get';
import { JWTUser } from '../jwt.types';

export const CurrentUser = createParamDecorator((_, req): JWTUser => get(req, 'args[2].req.user'));
export const CurrentUserRest = createParamDecorator((empty, reqArgs: any): JWTUser => reqArgs.args[1].request.user);
