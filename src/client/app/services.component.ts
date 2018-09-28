import { Component, OnInit } from '@angular/core';

import { Service } from './service';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html'
})
export class ServicesComponent implements OnInit {
  addingService = false;
  editingService = false;
  services: any = [];
  selectedService: Service;

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.getServices();
  }

  cancel() {
    this.addingService = false;
	this.editingService = false;
    this.selectedService = null;
  }

  deleteService(service: Service) {
    this.serviceService.deleteService(service).subscribe(res => {
      this.services = this.services.filter(h => h !== service);
      if (this.selectedService === service) {
        this.selectedService = null;
      }
    });
  }

  getServices() {
    return this.serviceService.getServices().subscribe(services => {
      this.services = services;
    });
  }

  enableAddMode() {
    this.addingService = true;
	this.editingService = true;
    this.selectedService = new Service();
  }
  
  toggleEditMode(service: Service) {
	this.selectedService = service;
	this.editingService = !this.editingService;
  }

  onSelect(service: Service) {
    this.addingService = false;
	this.editingService = false;
    this.selectedService = service;
  }

  save() {
    if (this.addingService) {
      this.serviceService.addService(this.selectedService).subscribe(service => {
        this.addingService = false;
        this.selectedService = null;
        this.services.push(service);
      });
    } else {
      this.serviceService.updateService(this.selectedService).subscribe(service => {
        this.addingService = false;
        this.selectedService = null;
      });
    }
  }
}
