import { cablex, stopCableX } from '../src/cable-x';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
describe('CableXErrors', () => {
  beforeAll(() => {
    // window.cableXConfig = null;
  });
  afterAll(() => {
    stopCableX();
  });
  it('Will throw error if used before configuration', (done) => {
    cablex('get', '/', {})
      .pipe(
        catchError((error) => {
          return of({ message: error.message });
        })
      )
      .subscribe((result: any) => {
        expect(result.message).toBe(
          'Call configure before calling any methods'
        );
        done();
      });
  });
});
