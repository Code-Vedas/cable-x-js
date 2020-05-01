import { CableXRequestOptions } from '../interfaces/cablex.request-options.interface';
import { of, AsyncSubject, Observable, throwError } from 'rxjs';
import { switchMap, map, timeout, catchError } from 'rxjs/operators';
import { CableXResponse } from '../interfaces/cablex.response.interface';
const ActionCable = require('actioncable');
import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { HttpMethod } from '../enums/http.method.enum';
import { CableXRequest } from '../interfaces/cablex.request.interface';
import { CableXRequestData } from '../interfaces/cablex.request.data.interface';

export class CableXRequestService {
  private cable: any;
  private subscription: any;
  private cableEvent = new AsyncSubject<any>();
  private dataSubjects: {
    request_id: string;
    dataSubject: AsyncSubject<any>;
  }[] = [];

  request(
    method: HttpMethod,
    path: string,
    options: CableXRequestOptions
  ): Observable<CableXResponse> {
    return this.handleRequest({
      method,
      path,
      options,
    });
  }
  private setCable() {
    if (this.cable && this.cable.connection.isOpen()) {
      this.cableEvent.next(this.cable);
      this.cableEvent.complete();
    } else {
      this.cable = ActionCable.createConsumer(
        `${window.cableXConfig.host}${window.cableXConfig.cablePath}`
      );
      this.subscription = this.cable.subscriptions.create(
        'CableX::Channel::CableXChannel',
        {
          // tslint:disable-next-line
          cmd: function (data: any) {
            this.perform('cmd', data);
          },
          connected: () => {
            this.cableEvent.next(this.cable);
            this.cableEvent.complete();
          },
          received: (receivedData: any) => {
            this.broadcastReceivedData(receivedData);
          },
        }
      );
    }
    return of({});
  }
  private perform(data: CableXRequestData) {
    this.subscription.cmd(data);
    return of(data);
  }
  private broadcastReceivedData(receivedData: any) {
    const dataSubjectObjectIndex = this.dataSubjects.findIndex(
      (obj) => obj.request_id === receivedData.request_id
    );
    /* istanbul ignore else  */
    if (dataSubjectObjectIndex >= 0) {
      const dataSubjectObject = this.dataSubjects.splice(
        dataSubjectObjectIndex
      )[0];
      dataSubjectObject.dataSubject.next(receivedData);
      dataSubjectObject.dataSubject.complete();
    }
  }
  private handleRequest(request: CableXRequest): Observable<CableXResponse> {
    if (window.cableXConfig === undefined) {
      return throwError(new Error('Call configure before calling any methods'));
    }
    const dataToSend = this.getDataToSend({ request });
    const dataSubject = new AsyncSubject();
    this.dataSubjects.push({
      dataSubject,
      request_id: dataToSend.request_id,
    });
    return this.setCable().pipe(
      switchMap(() => this.cableEvent),
      switchMap(() => this.perform(dataToSend)),
      switchMap(() => dataSubject),
      map((response: any) => {
        return {
          body: JSON.parse(response.body),
          headers: response.headers,
          status: response.code,
        };
      }),
      timeout(window.cableXConfig.timeout * 1000),
      catchError(() => {
        throw new Error(
          `Timeout waiting for response, CableX waited for atleast ${window.cableXConfig.timeout} seconds`
        );
      })
    );
  }
  getDataToSend({ request }: { request: CableXRequest }): CableXRequestData {
    const requestId = uuidv5(
      `${request.method}${window.cableXConfig.url}`,
      `${uuidv4()}`
    );
    return {
      request_id: requestId,
      method: request.method,
      path: request.path,
      data: request.options.body,
      params: request.options.params,
    };
  }
  stop() {
    /* istanbul ignore else  */
    if (this.cable) {
      this.cable.disconnect();
    }
  }
}
