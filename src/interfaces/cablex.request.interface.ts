import { CableXRequestOptions } from './cablex.request-options.interface';
export interface CableXRequest {
  method: string;
  path: string;
  options: CableXRequestOptions;
}
