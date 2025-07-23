import { HttpHeaders } from '@angular/common/http';

export abstract class AbstractService {
  protected readonly requestOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/vnd.api+json' }),
  };

  protected handleError(error: any): Promise<any> {
    let message: string;

    try {
      message = error.error.errors[0].detail;
      console.error('An error occurred:' + message);
    } catch (e) {
      message = 'An unknown error occurred: ' + error;
    }

    return Promise.reject(message);
  }
}
