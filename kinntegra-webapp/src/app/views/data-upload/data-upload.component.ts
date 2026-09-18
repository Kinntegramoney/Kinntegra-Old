import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { AdminMasterLeftbarTemplateComponent } from '../../templates/admin-master-leftbar-template/admin-master-leftbar-template.component';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { DataUploadService } from '../../services/data-upload.service';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-data-upload',
  standalone: true,
  imports: [HeaderRightTemplateComponent, HttpClientModule, AdminMasterLeftbarTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, NgbDropdownModule],
  templateUrl: './data-upload.component.html',
  styleUrl: './data-upload.component.scss',
  providers: [DataUploadService]
})
export class DataUploadComponent {


  documentFileExcel: any;
  LastModifiedDate: any;
  appErrors!: any;
  isBusyExcel: boolean = false;


  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(
    private router: Router,
    private dataUploadService: DataUploadService,
    private modalService: NgbModal,
    // private httpClient: HttpClient
  ) { }


  ngOninit() {
    this.onRefresh()

  }

  onRefresh() {
    this.LastModifiedDate
    // console.log(this.LastModifiedDate)
  }

  clearDocument(type: boolean) {
    const fileInput = type ? <HTMLInputElement>document.getElementById('fileDropExcelRef') : <HTMLInputElement>document.getElementById('fileDropZipRef');
    if (fileInput) {
      fileInput.value = '';
    }
    if (type) {
      this.documentFileExcel = undefined;
    }
    // else{
    //   this.documentFileZip = undefined
    // }
  }

  onFileDropped(files: any, type: boolean) {
    let file = files[0];
    if (file && type) {
      this.documentFileExcel = file;
    }
    // else if(file && !type){
    //   this.documentFileZip = file;
    // }
  }

  fileBrowseHandler(event: any, type: boolean) {
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
      this.appErrors.push({ Title: 'Select document' });
    }
    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  onSaveCommercial() {
    this.isBusyExcel = true;

    if (!this.validateExcel()) {
      this.isBusyExcel = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = new FormData();
    inputData.append('documentFile', this.documentFileExcel);

    this.dataUploadService.UploadCommercialExcel(inputData).subscribe({
      next: (result) => {
        if (result.Status) {
          this.LastModifiedDate = result.MaxModifiedDate;
          // console.log(this.LastModifiedDate)
          this.alertBoxMsg(result.Message, result.Status, '/data-upload');
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

  onSaveAMCs() {
    this.isBusyExcel = true;

    if (!this.validateExcel()) {
      this.isBusyExcel = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = new FormData();
    inputData.append('documentFile', this.documentFileExcel);

    this.dataUploadService.UploadAMCsExcel(inputData).subscribe({
      next: (result) => {
        if (result.Status) {
          this.LastModifiedDate = result.MaxModifiedDate;
          // console.log(this.LastModifiedDate)
          this.alertBoxMsg(result.Message, result.Status, '/data-upload');
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

  onSaveCostInflationIndex() {
    this.isBusyExcel = true;

    if (!this.validateExcel()) {
      this.isBusyExcel = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = new FormData();
    inputData.append('documentFile', this.documentFileExcel);

    this.dataUploadService.UploadCostInflationIndexExcel(inputData).subscribe({
      next: (result) => {
        if (result.Status) {
          this.LastModifiedDate = result.MaxModifiedDate;
          // console.log(this.LastModifiedDate)
          this.alertBoxMsg(result.Message, result.Status, '/data-upload');
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

  onSaveIncomeCategory() {
    this.isBusyExcel = true;

    if (!this.validateExcel()) {
      this.isBusyExcel = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = new FormData();
    inputData.append('documentFile', this.documentFileExcel);

    this.dataUploadService.UploadIncomeCategoryExcel(inputData).subscribe({
      next: (result) => {
        if (result.Status) {
          this.LastModifiedDate = result.MaxModifiedDate;
          // console.log(this.LastModifiedDate)
          this.alertBoxMsg(result.Message, result.Status, '/data-upload');
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

  onSaveAnnualIncome() {
    this.isBusyExcel = true;

    if (!this.validateExcel()) {
      this.isBusyExcel = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = new FormData();
    inputData.append('documentFile', this.documentFileExcel);

    this.dataUploadService.UploadAnnualIncomeExcel(inputData).subscribe({
      next: (result) => {
        if (result.Status) {
          this.LastModifiedDate = result.MaxModifiedDate;
          // console.log(this.LastModifiedDate)
          this.alertBoxMsg(result.Message, result.Status, '/data-upload');
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


  onSaveCountryIncome() {
    this.isBusyExcel = true;

    if (!this.validateExcel()) {
      this.isBusyExcel = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = new FormData();
    inputData.append('documentFile', this.documentFileExcel);

    this.dataUploadService.UploadCountryExcel(inputData).subscribe({
      next: (result) => {
        if (result.Status) {
          this.LastModifiedDate = result.MaxModifiedDate;
          // console.log(this.LastModifiedDate)
          this.alertBoxMsg(result.Message, result.Status, '/data-upload');
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

  // uploadCommercialDocumentExcel(input: any) {
  //   this.dataUploadService.UploadCommercialExcel(input).subscribe({
  //     next: (result) => {
  //       if (result.Status) {
  //         this.LastModifiedDate = result.MaxModifiedDate;
  //         console.log(this.LastModifiedDate)
  //         this.alertBoxMsg(result.Message, result.Status, '/data-upload');
  //       } else {
  //         this.alertBoxMsg(result.Message, result.Status, null);
  //       }
  //       this.isBusyExcel = true;
  //   if (!this.validateExcel()) {
  //     this.isBusyExcel = false;
  //     const modalRef = this.modalService.open(AlertDialogComponent);
  //     modalRef.componentInstance.data = this.appErrors;
  //     return;
  //   }
  //   let inputData = new FormData();
  //   inputData.append('documentFile', this.documentFileExcel);
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

  // onSaveExcel() {
  //   this.isBusyExcel = true;
  //   if (!this.validateExcel()) {
  //     this.isBusyExcel = false;
  //     const modalRef = this.modalService.open(AlertDialogComponent);
  //     modalRef.componentInstance.data = this.appErrors;
  //     return;
  //   }
  //   let inputData = new FormData();
  //   inputData.append('documentFile', this.documentFileExcel);
  //   this.uploadCommercialDocumentExcel(inputData); 
  // }

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

  generatePdf() {
    this.dataUploadService.associatePdf().subscribe((result) => {
      if (result.Status == true) {
        // console.log("Hello1")
        var fileName = result.Data.FileName;
        var url = new URL(environment.BASE_API_URL + '/doc/report/' + fileName);

        const a = document.createElement('a');
        a.href = url.toString();
        a.download = fileName;
        a.click();
        // window.location.href = url;

        // var a = document.createElement('a');
        // document.body.appendChild(a);
        // a.setAttribute('style', 'display: none');
        // a.href = url;
        // // a.target = '_blank';
        // a.download = fileName;
        // a.click();
        // window.URL.revokeObjectURL(url);
        // a.remove();
      }
      // this.isBusyPreview = false;
      // this.isBusy = false;
    });
  }


  // Test() {
  //   this.isBusyExcel = true;
  //   let inputData = new FormData();
  //   inputData.append('documentFile', this.documentFileExcel);
  //   // let inputData={
  //   //   Name:"abhi"
  //   // }
  //   this.dataUploadService.ImportEmployeeDocument(inputData).subscribe((result) => {
  //     if (result.Status == true) {
  //       console.log("Hello1")
  //     }
  //   });
  // }



  // Test() {
  //   this.dataUploadService.ImportData().subscribe((result) => {
  //     if (result.Status == true) {
  //        console.log("Hello1")

  //     }

  //   });
  // }


}


