import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AssociateService } from '../../services/associate.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-associate-filter-modal',
  standalone: true,
  imports: [NgSelectModule, NgbModule, CommonModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, HttpClientModule, FormsModule],
  templateUrl: './associate-filter-modal.component.html',
  styleUrl: './associate-filter-modal.component.scss',
  providers: [AssociateService]
})
export class AssociateFilterModalComponent {
  @Input() FilterAssociateData!: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  states: any = [];
  cities: any = [];
  associates: any = [];
  status: any = [];
  lastLogins: any = [];

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private associateService: AssociateService,
  ) { }

  ngOnInit(): void {
    this.getFilterStates();
    this.getFilterCities();
    this.getFilterAssociate();
    this.getFilterStatus();
    this.getLastLogins();
  }

  getFilterStates(): void {
    this.associateService.GetFilterAssociateStates().subscribe((result) => {
      if (result.Status == true) {
        this.states = result.Data;
      }
    });
  }

  getFilterCities(): void {
    this.associateService.GetFilterAssociateCities().subscribe((result) => {
      if (result.Status == true) {
        this.cities = result.Data;
      }
    });
  }

  getFilterAssociate(): void {
    this.associateService.GetFilterAssociates().subscribe((result) => {
      if (result.Status == true) {
        this.associates = result.Data;
      }
    });
  }

  getFilterStatus(): void {
    this.associateService.GetFilterAssociateStatus().subscribe((result) => {
      if (result.Status == true) {
        this.status = result.Data;
      }
    });
  }

  getLastLogins() {
    this.lastLogins.push({ Name: 'Not Yet Login' });
    this.lastLogins.push({ Name: 'Less Than 15 Days' });
    this.lastLogins.push({ Name: '15 Days - 1 Month' });
    this.lastLogins.push({ Name: '1 Month - 3 Months' });
    this.lastLogins.push({ Name: '3 Months - 6 Months' });
    this.lastLogins.push({ Name: '6 Months - 1 Year' });
    this.lastLogins.push({ Name: 'More Than 1 Year' });
  }

  onFilter() {
    this.passEntry.emit(this.FilterAssociateData);
    this.modalService.dismissAll();
  }

  onClearFilter() {
    this.FilterAssociateData = {
      selectedStates: [],
      selectedCities: [],
      selectedAssociate: [],
      selectedStatus: [],
      selectedLastLogins: []
    }
  }

  onRemoveFilter() {
    this.FilterAssociateData = {
      selectedStates: [],
      selectedCities: [],
      selectedAssociate: [],
      selectedStatus: [],
      selectedLastLogins: []
    }
    this.passEntry.emit(this.FilterAssociateData);
    this.modalService.dismissAll();
  };

  onClose() {
    this.modalService.dismissAll();
  }
}
