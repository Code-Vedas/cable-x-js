import { cablexConfigure, cablex, stopCableX } from '../src/cable-x';
import { HttpMethod } from '../src/enums/http.method.enum';
import { WebSocket as MockWebSocket } from 'mock-socket';
import { getMockServer } from '../mocks/cable-x.spec.mocks';
const ActionCable = require('actioncable');
let mockServer: any = null;
describe('CableX', () => {
  beforeAll(() => {
    mockServer = getMockServer();
    mockServer.start();
    ActionCable.WebSocket = MockWebSocket;
    cablexConfigure({
      host: 'ws://ws.example.com',
      cablePath: '',
      timeout: 4000,
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
  it('Can call GET Method', (done) => {
    cablex(HttpMethod.GET, '/', {}).subscribe((result: any) => {
      expect(result.body.version).not.toBe('');
      done();
    });
  });
  it('Can call GET Method, while keeping connection alive', (done) => {
    cablex(HttpMethod.GET, '/', {}).subscribe((result: any) => {
      expect(result.body.version).not.toBe('');
      cablex(HttpMethod.GET, '/', {}).subscribe((resultInner: any) => {
        expect(resultInner.body.version).not.toBe('');
        done();
      });
    });
  });
});
