import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModalOptions, NgbActiveModal, NgbModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '../../services/employee.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-employee-rejection-modal',
  standalone: true,
  imports: [NgbModule, FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbDropdownModule],
  templateUrl: './employee-rejection-modal.component.html',
  styleUrl: './employee-rejection-modal.component.scss',
  providers: [EmployeeService]
})
export class EmployeeRejectionModalComponent {
  @Input()
  public EmployeeCertificateId!: any;
  employeeRejectionId!: any;
  appErrors!: Apperrormessage[];
  objEmployeeReason!: any;


  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private employeeService: EmployeeService,
  ) { }



  ngOnInit(): void {
    this.onRefresh();
  }

  onRefresh() {
    this.objEmployeeReason = {
      Id: this.EmployeeCertificateId,
      RejectionMessage: ''
    }
  }

  onSave() {
    var inputData = {
      EmployeeId: this.objEmployeeReason.Id,
      RejectionMessage: this.objEmployeeReason.reason
    }
    this.employeeService.SaveEmployeeRejectionDetails(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          let notificationInputData = {
            EmployeeId: result.Data
          };
          this.employeeService.SendSelfRejectedNotification(notificationInputData).subscribe((nresult) => {
            if (nresult.Status == true) {
              this.router.navigate(['employee-rejection-feedback/' + this.objEmployeeReason.Id]);
              this.modalService.dismissAll();
            }
          });
         
        } else {

 
          // this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        // this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: err.error });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );

  }

}