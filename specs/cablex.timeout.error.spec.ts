import { catchError } from 'rxjs/operators';
import { cablexConfigure, cablex, stopCableX } from '../src/cable-x';
import { WebSocket as MockWebSocket } from 'mock-socket';
import { getMockServer } from '../mocks/cable-x.spec.mocks';
const ActionCable = require('actioncable');
import { of } from 'rxjs';
let mockServer: any = null;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
describe('CableX', () => {
  beforeAll(() => {
    mockServer = getMockServer();
    mockServer.start();
    ActionCable.WebSocket = MockWebSocket;
    cablexConfigure({
      host: 'ws://ws.example.com',
      cablePath: '',
      timeout: 4,
    });
  });
  afterAll(() => {
    mockServer.stop();
    stopCableX();
  });
  it('Can be configured', () => {
    expect(window.cableXConfig.host).toBe('ws://ws.example.com');
    expect(window.cableXConfig.cablePath).toBe('');
  });
  it('Can call GET Method, catching timeout error', (done) => {
    cablex('get', '/timeout', {})
      .pipe(
        catchError((error) => {
          return of({ message: error.message });
        })
      )
      .subscribe((result: any) => {
        expect(result.message).toBe(
          'Timeout waiting for response, CableX waited for atleast 4 seconds'
        );
        done();
      });
  });
});
