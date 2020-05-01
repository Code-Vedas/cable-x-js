import { CableXRequestService } from './cable-x.request.service';
import { CableXConfig } from '../config/cable-x-config';
import { CableXRequestOptions } from '../interfaces/cablex.request-options.interface';
import { CableXHttpMethod } from '../enums/cablex.http.method.enum';
import { Observable } from 'rxjs';
import { CableXResponse } from '..';

let cableXRequestService: CableXRequestService | undefined;
export const cablexConfigure = (config: CableXConfig) => {
  return (window.cableXConfig = config);
};
export const cablex = (
  method: CableXHttpMethod,
  path: string,
  options: CableXRequestOptions
): Observable<CableXResponse> => {
  if (cableXRequestService == null) {
    cableXRequestService = new CableXRequestService();
  }
  return cableXRequestService.request(method, path, options);
};
export const stopCableX = () => {
  /* istanbul ignore else  */
  if (cableXRequestService) {
    cableXRequestService.stop();
    cableXRequestService = undefined;
  }
};
