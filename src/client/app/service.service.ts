import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Service } from './service';

const api = '/api';

@Injectable()
export class ServiceService {
  constructor(private http: HttpClient) {}

  getServices() {
    return this.http.get<Array<Service>>(`${api}/services`)
  }

  deleteService(service: Service) {
    return this.http.delete(`${api}/service/${service._id}`);
  }

  addService(service: Service) {
    return this.http.post<Service>(`${api}/service/`, service);
  }

  updateService(service: Service) {
    return this.http.put<Service>(`${api}/service/${service._id}`, service);
  }
}
