import { Component, OnInit } from '@angular/core';
import { NgbDropdown, NgbDropdownModule, NgbModal, NgbModalOptions, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { NewLeadModalComponent } from '../../templates/new-lead-modal/new-lead-modal.component';
import { ColumnMode, SelectionType, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { LeadFilterModalComponent } from '../../templates/lead-filter-modal/lead-filter-modal.component';
import { LeadService } from '../../services/lead.service';
import { map } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { DeleteConfirmationDialogComponent } from '../../templates/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ActionConfirmationDialogComponent } from '../../templates/action-confirmation-dialog/action-confirmation-dialog.component';
import { AlertDialogComponent } from '../../templates/alert-dialog/alert-dialog.component';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppCryptoService } from '../../services/app-crypto.service';
import { FormsModule } from '@angular/forms';
import date from 'date-and-time';
import { AnimationLoader, AnimationOptions, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { ClientService } from '../../services/client.service';
import { AppGlobalService } from '../../services/app-global.service';


@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, NgbModule, LottieComponent],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, LeadService, AppCryptoService, ClientService]
})
export class LeadsComponent implements OnInit {
  appErrors!: Apperrormessage[];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  objLeads: any = [];
  objLeadsAll: any = [];
  objLeadsIntroduction: any = [];
  objLeadsIntroductionAll: any = [];
  objLeadsComprehensive: any = [];
  objLeadsComprehensiveAll: any = [];
  objLeadsAccount: any = [];
  objLeadsAccountAll: any = [];
  objSearchKeyword: string = '';
  activeTab: number = 1;
  AssociateId: any;

  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/workinprogress.json',
  };

  constructor(
    private modalService: NgbModal,
    private leadService: LeadService,
    private router: Router,
    private appCryptoService: AppCryptoService,
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    this.AssociateId = AppGlobalService.CurrentAssociate;
    this.getLeads();
    this.getLeadsIntroduction();
    this.getLeadsComprehensive();
    this.getLeadsAccount();
  }

  getLeads() {
    this.leadService.GetLeadList().pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            const ClientInitials = `${item.FirstName.charAt(0)}${item.LastName.charAt(0)}`;
            const ClientName = `${item.FirstName} ${item.LastName}`;
            return { ...item, ClientInitials, ClientName };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.objLeads = modifiedData;
      this.objLeadsAll = modifiedData;
    });
  }

  getLeadsIntroduction() {
    this.leadService.GetLeadIntroductionList().pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            let name = item.FamilyName.toUpperCase().replace('& FAMILY', '').trim();
            let nameArray = name.split(' ');

            let firstInitial = nameArray[0].charAt(0);
            let lastInitial = '';
            if (nameArray.length > 1) {
              lastInitial = nameArray[nameArray.length - 1].charAt(0);
            }

            const ClientInitials = `${firstInitial}${lastInitial}`;
            const ClientName = `${item.FamilyName}`;
            return { ...item, ClientInitials, ClientName };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.objLeadsIntroduction = modifiedData;
      this.objLeadsIntroductionAll = modifiedData;
    });
  }

  getLeadsComprehensive() {
    this.leadService.GetLeadComprehensiveList().pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            let name = item.FamilyName.toUpperCase().replace('& FAMILY', '').trim();
            let nameArray = name.split(' ');

            let firstInitial = nameArray[0].charAt(0);
            let lastInitial = '';
            if (nameArray.length > 1) {
              lastInitial = nameArray[nameArray.length - 1].charAt(0);
            }

            const ClientInitials = `${firstInitial}${lastInitial}`;
            const ClientName = `${item.FamilyName}`;
            return { ...item, ClientInitials, ClientName };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.objLeadsComprehensive = modifiedData;
      this.objLeadsComprehensiveAll = modifiedData;
    });
  }

  getLeadsAccount() {
    this.clientService.GetClientAccountListByAssociateId(this.AssociateId).pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            let name = item.FirstAccountHolderName.toUpperCase().trim();
            let nameArray = name.split(' ');

            let firstInitial = nameArray[0].charAt(0);
            let lastInitial = '';
            if (nameArray.length > 1) {
              lastInitial = nameArray[nameArray.length - 1].charAt(0);
            }

            const ClientInitials = `${firstInitial}${lastInitial}`;
            const ClientName = item.AccountHolderName + ((item.NomineeName != '') ? ' | Nom: ' + item.NomineeName : '') + ((item.GaurdianName != '') ? ' | GD: ' + item.GaurdianName : '');
            return { ...item, ClientInitials, ClientName };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.objLeadsAccount = modifiedData;
      this.objLeadsAccountAll = modifiedData;
    });
  }

  onEditLead(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(NewLeadModalComponent, ngbModalOptions);
    modalRef.componentInstance.leadId = row.Id;
    modalRef.componentInstance.mode = 'edit';
  }


  onDeleteLead(row: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    const modalRef = this.modalService.open(DeleteConfirmationDialogComponent, ngbModalOptions);

    var inputData = {
      Id: row.Id
    };

    modalRef.result.then(result => {
      if (result == true) {
        // this.isBusy = true;
        // this.isBusyDelete = true;
        this.leadService.DeleteLead(inputData).subscribe(
          (res) => {
            // this.isBusy = false;
            // this.isBusyDelete = false;
            const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
            dialogRefC.componentInstance.message = "Lead record delete successfully.";
            dialogRefC.result.then(result => {
              if (result == true) {
                this.modalService.dismissAll();
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['leads']);
              }
            });
          },
          (err) => {
            // this.isBusy = false;
            // this.isBusyDelete = false;
            this.modalService.dismissAll();
            this.appErrors = [];
            this.appErrors.push({ Title: err.error });
            const modalRef = this.modalService.open(AlertDialogComponent);
            modalRef.componentInstance.data = this.appErrors;
          }
        );
      }
    });

  }

  onNewLeadClick(): void {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(NewLeadModalComponent, ngbModalOptions);
    modalRef.componentInstance.leadId = '414E2B5048745659672B513D';
    modalRef.componentInstance.mode = 'create';
  }

  onFilterClick(): void {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(LeadFilterModalComponent, ngbModalOptions);
  }

  onProceedIntro(row: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-introduction/' + row.ClientId + '/' + row.Id + '/' + this.appCryptoService.ParamEncrypt('create')]);
  }

  onProceedDataGathering(row: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-introduction/' + row.ClientId + '/' + row.Id + '/' + this.appCryptoService.ParamEncrypt('create')]);
  }

  onProceedAccountDataGathering(row: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-introduction/' + row.ClientId + '/' + row.LeadId + '/' + this.appCryptoService.ParamEncrypt('edit')]);
  }

  onProceedAccountOpening(row: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-introduction/' + row.ClientId + '/' + row.Id + '/' + this.appCryptoService.ParamEncrypt('create')]);
  }

  onProceedTransaction(row: any) { }

  onViewClientAccount(row: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-introduction/' + row.ClientId + '/' + row.LeadId + '/' + this.appCryptoService.ParamEncrypt('view')]);
  }

  onEditClientAccount(row: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-introduction/' + row.ClientId + '/' + row.LeadId + '/' + this.appCryptoService.ParamEncrypt('edit')]);
  }

  onEditClient(row: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['client-introduction/' + row.ClientId + '/' + row.Id + '/' + this.appCryptoService.ParamEncrypt('edit')]);
  }

  onDeleteClient(row: any) {
    console.log(row.ClientId);
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
    const modalRef = this.modalService.open(DeleteConfirmationDialogComponent, ngbModalOptions);

    var inputData = {
      Id: row.ClientId
    };

    modalRef.result.then(result => {
      if (result == true) {
        this.clientService.DeleteClient(inputData).subscribe(
          (res) => {
            const dialogRefC = this.modalService.open(ActionConfirmationDialogComponent, ngbModalOptions);
            dialogRefC.componentInstance.message = "Client record delete successfully.";
            dialogRefC.result.then(result => {
              if (result == true) {
                this.modalService.dismissAll();
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['leads']);
              }
            });
          },
          (err) => {
            this.modalService.dismissAll();
            this.appErrors = [];
            this.appErrors.push({ Title: err.error });
            const modalRef = this.modalService.open(AlertDialogComponent);
            modalRef.componentInstance.data = this.appErrors;
          }
        );
      }
    });
  }

  searchClientRecord(): void {
    switch (this.activeTab) {
      case 1:
        let filterResult1 = this.objLeadsAll;

        filterResult1 = filterResult1.filter((res: any) => {
          return res.ClientName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.AssociateName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.City.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.LeadDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objLeads = [...filterResult1];
        break;
      case 2:
        let filterResult2 = this.objLeadsIntroductionAll;

        filterResult2 = filterResult2.filter((res: any) => {
          return res.ClientName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.AssociateName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.City.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.LeadDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objLeadsIntroduction = [...filterResult2];
        break;
      case 3:
        let filterResult3 = this.objLeadsComprehensiveAll;

        filterResult3 = filterResult3.filter((res: any) => {
          return res.ClientName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.AssociateName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.City.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.LeadDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objLeadsComprehensive = [...filterResult3];
        break;
      case 4:
        let filterResult4 = this.objLeadsAccountAll;

        filterResult4 = filterResult4.filter((res: any) => {
          return res.ClientName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.AssociateName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.City.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            date.format(new Date(res.AccountCreatedDate), 'DD-MM-YYYY').toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objLeadsAccount = [...filterResult4];
        break;
    }
  }

  animationCreated(animationItem: AnimationItem): void {
  }
}
