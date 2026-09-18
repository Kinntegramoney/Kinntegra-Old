import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { HttpClientModule  } from '@angular/common/http';
import { BseImportService } from '../../services/bse-import.service';

@Component({
  selector: 'app-sip-scheme-master-upload',
  standalone: true,
  imports: [HeaderRightTemplateComponent,HttpClientModule, AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule],
  templateUrl: './sip-scheme-master-upload.component.html',
  styleUrl: './sip-scheme-master-upload.component.scss',
  providers: [BseImportService]
})

export class SipSchemeMasterUploadComponent {
  documentFileExcel: any;
  LastModifiedDate:any;
  appErrors!: any;
  isBusyExcel: boolean = false;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(
    private router: Router,
    private bseImportService: BseImportService,
    private modalService: NgbModal,
    // private httpClient: HttpClient
  ) { }


  ngOninit() {
    this.onRefresh();
  }

  onRefresh() {
    this.LastModifiedDate
    // console.log(this.LastModifiedDate)
  }

  clearDocument(type : boolean) {
    const fileInput = type ? <HTMLInputElement>document.getElementById('fileDropExcelRef') :  <HTMLInputElement>document.getElementById('fileDropZipRef');
    if (fileInput) {
      fileInput.value = '';
    }
    if(type){
      this.documentFileExcel = undefined;
    }
    // else{
    //   this.documentFileZip = undefined
    // }
  }

  onFileDropped(files: any , type:boolean) {
    let file = files[0];
    if (file && type) {
      this.documentFileExcel = file;
    }
    // else if(file && !type){
    //   this.documentFileZip = file;
    // }
  }

  fileBrowseHandler(event: any , type:boolean) {
    let file = event.target.files[0];
    if (file && type) {
      this.documentFileExcel = file;
    }
    // else if(file && !type){
    //   this.documentFileZip = file;
    // }
  }

  validateExcel(): boolean {
    this.appErrors = [];
    if (this.documentFileExcel == '' || this.documentFileExcel == undefined) {
      this.appErrors.push({ Title: 'Upload document' });
    }
    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  // uploadDocumentExcel(input: any) {
  //   console.log(input);
  //   this.bseImportService.UploadSchemeExcel(input).subscribe({
  //     next: (result) => {
  //       if (result.Status) {
  //         // this.LastModifiedDate = result.MaxModifiedDate;
  //         // console.log(this.LastModifiedDate)
  //         this.alertBoxMsg(result.Message, result.Status, '/scheme-upload');
  //       } else {
  //         this.alertBoxMsg(result.Message, result.Status, null);
  //       }
  //     },
  //     error: (err) => {
  //       this.isBusyExcel = false;
  //       this.alertBoxMsg(err.error?.Message || 'Something went wrong', false, null);
  //     },
  //     complete:() => {
  //       this.isBusyExcel = false
  //     }
  //   }
  //   )
  // }

  onSaveExcel() {
    this.isBusyExcel = true;

    if (!this.validateExcel()) {
      this.isBusyExcel = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = new FormData();
    inputData.append('documentFile', this.documentFileExcel);

    this.bseImportService.UploadSIPSchemeExcel(inputData).subscribe({
      next: (result) => {
        if (result.Status) {
          this.LastModifiedDate = result.MaxModifiedDate;
          // console.log(this.LastModifiedDate)
          this.alertBoxMsg(result.Message, result.Status, '/sip-scheme-upload');
        } else {
          this.alertBoxMsg(result.Message, result.Status, null);
        }
      },
      error: (err) => {
        this.isBusyExcel = false;
        this.alertBoxMsg(err.error?.Message || 'Something went wrong', false, null);
      },
      complete: () => {
        this.isBusyExcel = false;
      }
    });
  }

  alertBoxMsg(errorMessage: any, status: boolean, navigateTo?: any) {
    if (status) {
      const dialogRefC = this.modalService.open(
        ActionConfirmationDialogComponent,
        this.ngbModalOptions
      );
      dialogRefC.componentInstance.message = `${errorMessage}`;
      dialogRefC.result.then((result) => {
        if (result == true) {
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([`${navigateTo}`]);
        }
      });
    } else {
      this.appErrors.push({ Title: `${errorMessage}` });
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      if (navigateTo) {
        modalRef.dismissed.subscribe((result) => {
          if (result == 'Cross click') {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate([`${navigateTo}`]);
          }
        });
      }
    }
  }

  onBack(): void {
    this.router.navigate(['admin-master']);
  }
}
