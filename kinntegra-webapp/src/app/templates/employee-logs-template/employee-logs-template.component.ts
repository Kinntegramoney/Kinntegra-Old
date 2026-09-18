import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmployeeService } from '../../services/employee.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-employee-logs-template',
  standalone: true,
  imports: [NgSelectModule, NgbModule, CommonModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule,HttpClientModule,FormsModule],
  templateUrl: './employee-logs-template.component.html',
  styleUrl: './employee-logs-template.component.scss',
  providers: [EmployeeService]
})
export class EmployeeLogsTemplateComponent {
  verificationArray!: any[];
  @Input() EmployeeId!: string;
  @Input() EmployeeName!: string;
  dateModel: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.getEmployeeViewLog(this.EmployeeId);
  }

  onClose() {
    this.modalService.dismissAll();
  }


  getEmployeeViewLog(employeeId:any) {
    this.employeeService.GetEmployeeViewLogById(employeeId).subscribe((result) => {
      if (result.Status == true) {
         this.verificationArray = result.Data;
      }
    });
  }
}
