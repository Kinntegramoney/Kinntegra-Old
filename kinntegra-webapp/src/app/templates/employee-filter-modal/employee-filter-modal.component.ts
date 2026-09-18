import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmployeeService } from '../../services/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeFilterService } from '../../services/employee-filter.service';

@Component({
  selector: 'app-employee-filter-modal',
  standalone: true,
  imports: [NgSelectModule, NgbModule, CommonModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule, HttpClientModule, FormsModule],
  templateUrl: './employee-filter-modal.component.html',
  styleUrl: './employee-filter-modal.component.scss',
  providers: [EmployeeService, EmployeeFilterService]
})
export class EmployeeFilterModalComponent {
  @Input() FilterEmployeeData!: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  states: any = [];
  cities: any = [];
  associates: any = [];
  departments: any = [];
  grades: any = [];
  employees: any = [];
  statues: any = [];
  lastLogins: any = [];

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private employeeService: EmployeeService,
    private employeeFilterService: EmployeeFilterService
  ) { }

  ngOnInit(): void {
    this.getFilterStates();
    this.getFilterCities();
    this.getFilterAssociate();
    this.getFilterDepartment();
    this.getFilterGrade();
    this.getFilterEmployee();
    this.getFilterStatus();
    this.getLastLogins();
  }

  getFilterStates(): void {
    this.employeeFilterService.GetEmployeeFilterStates().subscribe((result) => {
      if (result.Status == true) {
        this.states = result.Data;
      }
    });
  }

  getFilterCities(): void {
    this.employeeFilterService.GetEmployeeFilterCities().subscribe((result) => {
      if (result.Status == true) {
        this.cities = result.Data;
      }
    });
  }

  getFilterAssociate(): void {
    this.employeeFilterService.GetEmployeeFilterAssociate().subscribe((result) => {
      if (result.Status == true) {
        this.associates = result.Data;
      }
    });
  }

  getFilterDepartment(): void {
    this.employeeFilterService.GetEmployeeFilterDepartment().subscribe((result) => {
      if (result.Status == true) {
        this.departments = result.Data;
      }
    });
  }

  getFilterGrade(): void {
    this.employeeFilterService.GetEmployeeFilterGrade().subscribe((result) => {
      if (result.Status == true) {
        this.grades = result.Data;
      }
    });
  }

  getFilterEmployee(): void {
    this.employeeFilterService.GetEmployeeFilterEmployeeName().subscribe((result) => {
      if (result.Status == true) {
        this.employees = result.Data;
      }
    });
  }

  getFilterStatus(): void {
    this.employeeFilterService.GetEmployeeFilterStatus().subscribe((result) => {
      if (result.Status == true) {
        this.statues = result.Data;

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
    this.passEntry.emit(this.FilterEmployeeData);
    this.modalService.dismissAll();
  }

  onClearFilter() {
    this.FilterEmployeeData = {
      selectedStates: [],
      selectedCities: [],
      selectedAssociate: [],
      selectedDepartment: [],
      selectedGrade: [],
      selectedEmployee: [],
      selectedStatus: [],
      selectedLastLogins: []
    }
  }

  onRemoveFilter() {
    this.FilterEmployeeData = {
      selectedStates: [],
      selectedCities: [],
      selectedAssociate: [],
      selectedDepartment: [],
      selectedGrade: [],
      selectedEmployee: [],
      selectedStatus: [],
      selectedLastLogins: []
    }
    this.passEntry.emit(this.FilterEmployeeData);
    this.modalService.dismissAll();
  };

  onClose() {
    // this.passEntry.emit(null);
    this.modalService.dismissAll();
  }
}
