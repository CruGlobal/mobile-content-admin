import {Headers} from '@angular/http';

export const request_constants = {
  options: {
    headers : new Headers({'Content-Type': 'application/vnd.api+json'})
  }
};
