import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Response as ExpressResponse } from 'express';

@Injectable()
export class ResponseAddContentRangeToHeaderInterceptor implements NestInterceptor {
  intercept(context:ExecutionContext, next:CallHandler): Observable<any> {

    const ResponseObj:ExpressResponse = context.switchToHttp().getResponse();
    ResponseObj.setHeader('Access-Control-Expose-Headers', 'Content-Range' );
    return next.handle();
  }
}