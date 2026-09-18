import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnMode, SelectionType, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule, NgbDropdownModule, NgbDateAdapter, NgbModalOptions, NgbNavModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClientLeftbarTemplateComponent } from '../../templates/client-leftbar-template/client-leftbar-template.component';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Apperrormessage } from '../../models/apperrormessage';
import { AppCryptoService } from '../../services/app-crypto.service';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeFilterModalComponent } from '../../templates/employee-filter-modal/employee-filter-modal.component';

@Component({
  selector: 'app-comprehensive-plan-surplus',
  standalone: true,
  imports: [FormsModule,CommonModule,NgSelectModule,NgbModule,NgbDropdownModule,HeaderRightTemplateComponent,ClientLeftbarTemplateComponent, NgbNavModule, RouterLink, NgxDatatableModule, NgbDropdown, EmployeeFilterModalComponent, HttpClientModule],
  templateUrl: './comprehensive-plan-surplus.component.html',
  styleUrl: './comprehensive-plan-surplus.component.scss'
})
export class ComprehensivePlanSurplusComponent {

  minDate: any;
  maxDate: any;
  leadId!: any;
  clientId!: any;
  mode!: any;
  proceedTo: string = '';
  appErrors!: Apperrormessage[];
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  activeMemberTab: number = -1;
  activeCompanyTab: number = -1;
  showEdit: boolean = false;
  isEdit: boolean = false;
  isBusy!: boolean;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  financialData = [
    { parameter: 'Income', ashish: '₹10.56K', neha: '₹10.56K', total: '₹10.56K' },
    { parameter: 'Expense weightage', ashish: '₹10.56K', neha: '₹10.56K', total: '₹10.56K' },
    { parameter: 'Expense', ashish: '₹10.56K', neha: '₹10.56K', total: '₹10.56K' },
    { parameter: 'Savings', ashish: '₹10.56K', neha: '₹10.56K', total: '₹10.56K' }
  ];

  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/client.json',
  };

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModule,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    const current = new Date();
    this.minDate = { year: 1900, month: 1, day: 1 };
    this.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.leadId = this.activatedroute.snapshot.paramMap.get('leadid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);

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

    // this.onRefresh();

  }
  onNext() {
    if (this.mode == null) {
      this.router.navigate(['comprehensive-plan-allocation/' + this.clientId]);
    }
    else {
      this.router.navigate(['comprehensive-plan-allocation/' + this.clientId + '/' + this.appCryptoService.ParamEncrypt(this.mode)]);
    }
  }
}
