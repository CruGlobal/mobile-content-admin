import { HttpHeaders } from '@angular/common/http';

export abstract class AbstractService {
  protected readonly requestOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/vnd.api+json' }),
  };

  protected handleError(error: any): Promise<any> {
    let message: string;
    try {
      if (typeof error.error === 'string') {
        error.error = JSON.parse(error.error);
      }
      message = error.error.errors[0].detail;
    } catch {
      message = `An unknown error occurred: ${error}`;
    }
    console.error('An error occurred:', message);

    return Promise.reject(message);
  }
}
