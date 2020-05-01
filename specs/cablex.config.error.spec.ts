import { cablex, stopCableX } from '../src/cable-x';
import { HttpMethod } from '../src/enums/http.method.enum';
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
    cablex(HttpMethod.GET, '/', {})
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
