import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModalOptions, NgbActiveModal, NgbModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AssociateService } from '../../services/associate.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-associate-rejection-modal',
  standalone: true,
  imports: [NgbModule, FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbDropdownModule],
  templateUrl: './associate-rejection-modal.component.html',
  styleUrl: './associate-rejection-modal.component.scss',
  providers: [AssociateService]
})
export class AssociateRejectionModalComponent {
  @Input()
  public AssociateCertificateId!: any;
  associateRejectionId!: any;
  appErrors!: Apperrormessage[];
  objAssociateReason!: any;


  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private associateService: AssociateService,
  ) { }

  ngOnInit(): void {
    this.onRefresh();
  }

  onRefresh() {
    this.objAssociateReason = {
      Id: this.AssociateCertificateId,
      RejectionMessage: ''
    }
  }

  onSave() {
    var inputData = {
      AssociateId: this.objAssociateReason.Id,
      RejectionMessage: this.objAssociateReason.reason
    }
    // console.log(inputData);
    this.associateService.SaveAssociateRejection(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          let notificationInputData = {
            AssociateId: result.Data
          };
          this.associateService.SendRejectionNotificationSupervisor(notificationInputData).subscribe((nresult) => {
            if (nresult.Status == true) {
              this.router.navigate(['associate-rejection-feedback/'+ this.associateRejectionId]);
              this.modalService.dismissAll();
            }
          });
        }
        // if (result.Status == true) {
        //   this.associateRejectionId = result.Data;
        //   this.router.navigate(['associate-rejection-feedback/'+ this.associateRejectionId]);
        //   this.modalService.dismissAll();
        // } 
        else {
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
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );

  }

  onClose() {
    // this.passEntry.emit(null);
    this.modalService.dismissAll();
  }

}
