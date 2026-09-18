import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { EmployeeLeftbarTemplateComponent } from '../../templates/employee-leftbar-template/employee-leftbar-template.component';
import { BankAccountTypeService } from '../../services/bank-account-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BankService } from '../../services/bank.service';
import { EmployeeService } from '../../services/employee.service';
import { Apperrormessage } from '../../models/apperrormessage';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { DocumentPreviewModalComponent } from '../../templates/document-preview-modal/document-preview-modal.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';
import { FileDisplayNamePipe } from "../../file-display-name.pipe";

@Component({
    selector: 'app-employee-bank-details',
    standalone: true,
    templateUrl: './employee-bank-details.component.html',
    styleUrl: './employee-bank-details.component.scss',
    providers: [
        provideLottieOptions({
            player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
        }),
        AnimationLoader, BankAccountTypeService, BankService, EmployeeService, AppCryptoService
    ],
    imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule, NgbDropdownModule, HeaderRightTemplateComponent, ClientLeftbarTemplateComponent, EmployeeLeftbarTemplateComponent, LottieComponent, FileDisplayNamePipe]
})
export class EmployeeBankDetailsComponent {
  employeeBankId!: any;
  accountTypes: any = [];
  objEmployeeBank!: any
  files: any;
  bankDetailsDocumentFileUrl: any;
  bankDetailsDocumentFile!: any
  bankDetailsDocumentFileName!: any
  appErrors!: Apperrormessage[];
  employeeMode!: any;
  mode!: any;
  isBusy!: boolean;
  showEdit: boolean = false;
  isEdit: boolean = false;
  ts!: any;
  documentModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/employee.json',
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private bankAccountTypeService: BankAccountTypeService,
    private bankService: BankService,
    private employeeService: EmployeeService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.employeeBankId = this.activatedroute.snapshot.paramMap.get('employeeid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.ts = (this.activatedroute.snapshot.paramMap.get('ts') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('ts')) : null);

    switch (this.mode) {
      case 'create':
        this.showEdit = false;
        this.isEdit = true;
        break;
      case 'verify':
        this.showEdit = true;
        this.isEdit = !this.showEdit;
        break;
      case 'externalverify':
        this.showEdit = false;
        this.isEdit = false;
        break;
      case 'edit':
        this.showEdit = true;
        this.isEdit = !this.showEdit;
        break;
      case 'viewdetails':
        this.showEdit = false;
        this.isEdit = false;
        break;
      default:
        this.showEdit = false;
        this.isEdit = false;
        break;
    }

    this.onRefresh();
  }

  onRefresh() {
    this.objEmployeeBank = {
      Id: '414E2B5048745659672B513D',
      EmployeeId: this.employeeBankId,
      IFSC: '',
      BankName: '',
      Branch: '',
      MICR: '',
      BankAccountTypeId: null,
      AccountNumber: '',
      Mode:this.mode,
    },

      this.getBankAccountType();

    if (this.employeeBankId != null && this.employeeBankId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getEmployeeBankDetailsById(this.employeeBankId);
    }
  }


  onBack(): void {
    if (this.mode == null) {
      this.router.navigate(['employee-address-details/' + this.employeeBankId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-address-details/' + this.employeeBankId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-address-details/' + this.employeeBankId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }



  onEditClicked() {
    this.isEdit = true;
  
  }

getEmployeeBankDetailsById(empBankId: any) {
    this.employeeService.GetEmployeeBankDetailsById(empBankId).subscribe((result) => {
      if (result.Status == true) {
        let data = result.Data

        this.objEmployeeBank = {
          Id: data.Id,
          EmployeeId: data.EmployeeId,
          IFSC: data.IFSC,
          BankName: data.BankName,
          Branch: data.Branch,
          MICR: data.MICR,
          BankAccountTypeId: data.BankAccountTypeId,
          AccountNumber: data.AccountNumber
        }

        this.bankDetailsDocumentFileName = data.BankProofFileName;

      }

      else{
        this.bankDetailsDocumentFileName ='';
      }
    });
  }



  onIfscSearch() {
    this.getBankByIfsc(this.objEmployeeBank.IFSC);
  }


  getBankAccountType() {
    this.bankAccountTypeService.GetBankAccountType().subscribe((result) => {
      if (result.Status == true) {
        this.accountTypes = result.Data
      }
    });
  }

  getBankByIfsc(ifsc: any) {
    this.bankService.GetBankByIfsc(ifsc).subscribe((result) => {
      if (result.Status == true) {
        var data = result.Data;
        // console.log(data);

        this.objEmployeeBank = {
          Id: '414E2B5048745659672B513D',
          EmployeeId: this.employeeBankId,
          IFSC: data.IFSC,
          BankName: data.Name,
          Branch: data.Branch,
          MICR: data.MICRCode,
        }
      }
    });
  }


  onBankDetailsFileChanged(event: any) {
    const file = event.target.files[0];

    if (file) {
      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg') || (file.type == 'application/pdf')) {
        // this.hasFileError = false;
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {

            this.bankDetailsDocumentFileUrl = event.target.result as string;
          }
        };

        reader.readAsDataURL(file);
        this.bankDetailsDocumentFile = file;
        this.bankDetailsDocumentFileName = file.name;


      } else {
        // this.hasFileError = true;
      }
    }
  }

  onBankProofPreview() {
    if (this.bankDetailsDocumentFile != null) {
      const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
      modalRef.componentInstance.FileName = this.bankDetailsDocumentFile.name;
      modalRef.componentInstance.FileContent = this.bankDetailsDocumentFile;
      modalRef.componentInstance.FileType = this.bankDetailsDocumentFile.type;
      modalRef.componentInstance.FileUrl = this.bankDetailsDocumentFileUrl;
    }
    else {
      this.employeeService.GetEmployeeDocument(this.objEmployeeBank.EmployeeId, 'Bank Proof', this.bankDetailsDocumentFileName).subscribe((result) => {
        if (result.Status == true) {
          let document = result.Data;

          const modalRef = this.modalService.open(DocumentPreviewModalComponent, this.documentModalOptions);
          modalRef.componentInstance.FileName = document.FileName;
          modalRef.componentInstance.FileContent = document.FileContent;
          modalRef.componentInstance.FileType = document.FileContentType;
        }
      });
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  validate(): boolean {
    this.appErrors = [];


    if (this.objEmployeeBank.IFSC.trim() == "" || this.objEmployeeBank.IFSC == undefined) {
      this.appErrors.push({ Title: 'IFSC code cannot be blank for bank.' });
    }

    // else if (this.objEmployeeBank.IFSC.trim() !=="" && this.objEmployeeBank.IFSC.length<11) {
    //   this.appErrors.push({ Title: 'Mobile number should be 10 digit.' });
    // }


    if (this.objEmployeeBank.BankName.trim() == "" || this.objEmployeeBank.BankName == undefined) {
      this.appErrors.push({ Title: 'Bank name cannot be blank for bank.' });
    }


    if (this.objEmployeeBank.Branch.trim() == "" || this.objEmployeeBank.Branch == undefined) {
      this.appErrors.push({ Title: 'Bank branch cannot be blank for bank.' });
    }



    if (this.objEmployeeBank.BankAccountTypeId == null) {
      this.appErrors.push({ Title: 'Select account type from the list for bank.' });
    }



    if (this.objEmployeeBank.AccountNumber == undefined) {
      this.appErrors.push({ Title: 'Account number cannot be blank for bank.' });
    }

    if (this.objEmployeeBank.AccountNumber !== undefined) {

      if (this.objEmployeeBank.AccountNumber.trim() == "") {
        this.appErrors.push({ Title: 'Account number cannot be blank for bank.' });
      }
    }


    if (this.bankDetailsDocumentFileName == '' || this.bankDetailsDocumentFileName == undefined) {
      this.appErrors.push({ Title: 'Upload bank details  proof file.' });
    }
    if (this.appErrors.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }


  onProceed() {
    this.isBusy = true;
    // this.isBusySave = true;

    if (!this.validate()) {
      this.isBusy = false;
      // this.isBusySave = false;
      const modalRef = this.modalService.open(AlertDialogComponent);
      modalRef.componentInstance.data = this.appErrors;
      return;
    }

    let inputData = new FormData();
    inputData.append('Id', this.objEmployeeBank.Id);
    inputData.append('EmployeeId', this.employeeBankId);
    inputData.append('IFSC', this.objEmployeeBank.IFSC);
    inputData.append('BankName', this.objEmployeeBank.BankName);
    inputData.append('Branch', this.objEmployeeBank.Branch);
    inputData.append('MICR', this.objEmployeeBank.MICR);
    inputData.append('BankAccountTypeId', this.objEmployeeBank.BankAccountTypeId);
    inputData.append('AccountNumber', this.objEmployeeBank.AccountNumber);
    inputData.append('Mode', this.mode);

    if (this.bankDetailsDocumentFile) {
      inputData.append('BankDetailsDocumentFile', this.bankDetailsDocumentFile);
    }

    this.employeeService.SaveEmployeeBankDetails(inputData).subscribe(
      (result) => {
        if (result.Status == true) {
          this.employeeBankId = result.Data.Id

          if (this.mode == null) {
            this.router.navigate(['employee-certification/' + this.employeeBankId]);
          }
          else if (this.mode == 'externalverify') {
            this.router.navigate(['employee-certification/' + this.employeeBankId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
          }
          else {
            this.router.navigate(['employee-certification/' + this.employeeBankId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
          }

        }
        else {
          this.isBusy = false;
          this.appErrors = [];
          this.appErrors.push({ Title: result.Message });
          const modalRef = this.modalService.open(AlertDialogComponent);
          modalRef.componentInstance.data = this.appErrors;
        }
      },
      (err) => {
        this.isBusy = false;
        this.appErrors = [];
        this.appErrors.push({ Title: "Error while processing request." });
        const modalRef = this.modalService.open(AlertDialogComponent);
        modalRef.componentInstance.data = this.appErrors;
      }
    );
  }


  onNext() {
    if (this.mode == null) {
      this.router.navigate(['employee-certification/' + this.employeeBankId]);
    }
    else if (this.mode == 'externalverify') {
      this.router.navigate(['employee-certification/' + this.employeeBankId + '/' + this.appCryptoService.ParamEncrypt(this.mode) + '/' + this.appCryptoService.ParamEncrypt(this.ts)]);
    }
    else {
      this.router.navigate(['employee-certification/' + this.employeeBankId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }

}