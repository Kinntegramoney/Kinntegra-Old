import { Component, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDropdown, NgbDropdownModule, NgbModal, NgbModalOptions, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { ColumnMode, SelectionType, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AssociateFilterModalComponent } from '../../templates/associate-filter-modal/associate-filter-modal.component';
import { EmployeeFilterModalComponent } from '../../templates/employee-filter-modal/employee-filter-modal.component';
import { AssociateGeneralinfoComponent } from '../associate-generalinfo/associate-generalinfo.component';
import { AssociateService } from '../../services/associate.service';
import { map } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeLogsTemplateComponent } from '../../templates/employee-logs-template/employee-logs-template.component';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AssociateLogModalComponent } from '../../templates/associate-log-modal/associate-log-modal.component';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { CustomNgbDateAdapter } from '../CustomNgbDateAdapter';
import { CustomNgbDateParserFormatter } from '../CustomNgbDateParserFormatter';
import { AppGlobalService } from '../../services/app-global.service';
import { environment } from '../../../environments/environment';
import { IpServiceService } from '../../services/ip-service.service';
import { DeviceDetectorService } from 'ngx-device-detector';
// import { faEllipsis, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, NgxDatatableModule, NgbDropdown, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule],
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-account.component.scss',
  providers: [AssociateService, EmployeeService, AppCryptoService, DeviceDetectorService, IpServiceService,
    { provide: NgbDateAdapter, useClass: CustomNgbDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter }
  ]
})
export class AdminAccountComponent {

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  showAssociateSection = false;
  objAssociate: any = [];
  objAllAssociate: any = [];
  objEmployees: any = []
  objAllEmployees: any = [];
  employeeMode: any;
  associateMode: any;
  objName: string = '';
  filterEmployeeData: any;
  filterAssociateData: any;
  isSuperUser: boolean = false;
  isPrimaryAssociate: boolean = false;
  deviceInfo: any = [];
  objResetRequest: any;
  address: any;

  constructor(
    private dateAdapter: NgbDateAdapter<string>,
    private router: Router,
    private modalService: NgbModal,
    private associateService: AssociateService,
    private employeeService: EmployeeService,
    private appCryptoService: AppCryptoService,
    private ipAddress: IpServiceService,
    private deviceService: DeviceDetectorService,
  ) { }

  ngOnInit(): void {
    this.isSuperUser = (AppGlobalService.CurrentUserRole.toLowerCase() == 'sa');
    this.isPrimaryAssociate = AppGlobalService.IsPrimaryAssociate;

    this.showAssociateSection = (this.isSuperUser || this.isPrimaryAssociate);

    this.getAssociate();
    this.getEmployeeList();

    this.filterEmployeeData = {
      selectedStates: [],
      selectedCities: [],
      selectedAssociate: [],
      selectedDepartment: [],
      selectedGrade: [],
      selectedEmployee: [],
      selectedStatus: [],
      selectedLastLogins: []
    }

    this.filterAssociateData = {
      selectedStates: [],
      selectedCities: [],
      selectedAssociate: [],
      selectedStatus: [],
      selectedLastLogins: []
    }

    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.ipAddress.GetIPAddress().subscribe((result) => {
      this.address = result.ip;
    })
  }

  getAssociate() {
    this.associateService.GetAssociatesList().pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {

            const nameParts = item.AssociateName.split(" ");
            const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
            const lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
            const AssociateInitials = firstNameInitial + lastNameInitial;
            const AssociateName = `${item.AssociateName}`;
            return { ...item, AssociateInitials, AssociateName };
          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {

      this.objAssociate = modifiedData;
      this.objAllAssociate = modifiedData;
    });
  }

  getEmployeeList() {
    this.employeeService.GetEmployeeList().pipe(
      map((result: any) => {
        if (result.Status) {
          return result.Data.map((item: any) => {
            const nameParts = item.Name.split(" ");
            const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
            const lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
            const EmployeeInitials = firstNameInitial + lastNameInitial;


            return { ...item, EmployeeInitials };

          });
        }
        return [];
      })
    ).subscribe((modifiedData) => {
      this.objEmployees = modifiedData;
      this.objAllEmployees = modifiedData;
    });
  }

  searchAssociateRecord(): void {
    let filterResult = this.objAllAssociate;

    filterResult = filterResult.filter((res: any) => {
      return res.AssociateName.toLowerCase().match(this.objName.toLowerCase().trim()) ||
        res.EmployeeName.toLowerCase().match(this.objName.toLowerCase().trim()) ||
        res.Location.toLowerCase().match(this.objName.toLowerCase().trim()) ||
        res.EntityType.toLowerCase().match(this.objName.toLowerCase().trim());
    });
    this.objAssociate = [...filterResult];
  }

  searchRecord(): void {
    let filterResult = this.objAllEmployees;

    filterResult = filterResult.filter((res: any) => {
      return res.Name.toLowerCase().match(this.objName.toLowerCase().trim()) ||
        res.AssociateName.toLowerCase().match(this.objName.toLowerCase().trim()) ||
        res.DepartmentName.toLowerCase().match(this.objName.toLowerCase().trim()) ||
        res.Grade.toLowerCase().match(this.objName.toLowerCase().trim());

    });

    this.objEmployees = [...filterResult];
  }

  onAssociateFilterClick(): void {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(AssociateFilterModalComponent, ngbModalOptions);
    modalRef.componentInstance.FilterAssociateData = this.filterAssociateData;

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.filterAssociateData = receivedEntry;
      this.filterAssociate();
    });
  }

  filterAssociate() {
    var filteredAssociates = [];
    var resultData = [];

    if (this.objAllAssociate != null || this.objAllAssociate != undefined) {
      if (this.objAllAssociate.length > 0) {
        let allFilteredAssociates = this.objAllAssociate;

        //state filter
        for (let i = 0; i < this.filterAssociateData.selectedStates.length; i++) {
          const element = this.filterAssociateData.selectedStates[i];

          resultData = allFilteredAssociates.filter((x: any) => { return element.toLowerCase() == x.StateName.toLowerCase() });

          for (let k = 0; k < resultData.length; k++) {
            filteredAssociates.push(resultData[k]);
          }
        }

        //city filter
        var filteredCities = filteredAssociates;

        if (this.filterAssociateData.selectedCities.length > 0) {
          filteredAssociates = [];
        }

        for (let i = 0; i < this.filterAssociateData.selectedCities.length; i++) {
          const element = this.filterAssociateData.selectedCities[i];

          if (filteredCities.length > 0) {
            resultData = filteredCities.filter((x: any) => { return element.toLowerCase() == x.Location.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredAssociates.filter((x: any) => { return element.toLowerCase() == x.Location.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
        }

        //associate filter
        var filteredAssociate = filteredAssociates;

        if (this.filterAssociateData.selectedAssociate.length > 0) {
          filteredAssociates = [];
        }

        for (let i = 0; i < this.filterAssociateData.selectedAssociate.length; i++) {
          const element = this.filterAssociateData.selectedAssociate[i];

          if (filteredAssociate.length > 0) {
            resultData = filteredAssociate.filter((x: any) => { return element.toLowerCase() == x.AssociateName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredAssociates.filter((x: any) => { return element.toLowerCase() == x.AssociateName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
        }

        //account status filter
        var filteredStatus = filteredAssociates;

        if (this.filterAssociateData.selectedStatus.length > 0) {
          filteredAssociates = [];
        }

        for (let i = 0; i < this.filterAssociateData.selectedStatus.length; i++) {
          const element = this.filterAssociateData.selectedStatus[i];

          if (filteredStatus.length > 0) {
            resultData = filteredStatus.filter((x: any) => { return element.toLowerCase() == x.LogMessage.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredAssociates.filter((x: any) => { return element.toLowerCase() == x.LogMessage.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredAssociates.push(resultData[k]);
            }
          }
        }

        //last login filter
        var filteredLastLogin = filteredAssociates;

        if (this.filterAssociateData.selectedLastLogins.length > 0) {
          filteredAssociates = [];
        }

        for (let i = 0; i < this.filterAssociateData.selectedLastLogins.length; i++) {
          const element = this.filterAssociateData.selectedLastLogins[i];

          if (filteredLastLogin.length > 0) {
            switch (element.toLowerCase()) {
              case 'not yet login':
                resultData = filteredLastLogin.filter((x: any) => { return x.LoginDate == null });
                for (let k = 0; k < resultData.length; k++) {
                  filteredAssociates.push(resultData[k]);
                }
                break;
              case 'less than 15 days':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() });
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case '15 days - 1 month':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days').subtract(1, 'month');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case '1 month - 3 months':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month').subtract(3, 'months');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case '3 months - 6 months':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months').subtract(6, 'months');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case '6 months - 1 year':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months').subtract(1, 'year');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case 'more than 1 year':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'year');

                    if (currentLoginDate.isBefore(endDate) || currentLoginDate.isSame(endDate)) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
            }
          }
          else {
            switch (element.toLowerCase()) {
              case 'not yet login':
                resultData = allFilteredAssociates.filter((x: any) => { return x.LoginDate == null });
                for (let k = 0; k < resultData.length; k++) {
                  filteredAssociates.push(resultData[k]);
                }
                break;
              case 'less than 15 days':
                for (let i = 0; i < allFilteredAssociates.length; i++) {
                  let x = allFilteredAssociates[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() });
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case '15 days - 1 month':
                for (let i = 0; i < allFilteredAssociates.length; i++) {
                  let x = allFilteredAssociates[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days').subtract(1, 'month');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case '1 month - 3 months':
                for (let i = 0; i < allFilteredAssociates.length; i++) {
                  let x = allFilteredAssociates[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month').subtract(3, 'months');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case '3 months - 6 months':
                for (let i = 0; i < allFilteredAssociates.length; i++) {
                  let x = allFilteredAssociates[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months').subtract(6, 'months');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case '6 months - 1 year':
                for (let i = 0; i < allFilteredAssociates.length; i++) {
                  let x = allFilteredAssociates[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months').subtract(1, 'year');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
              case 'more than 1 year':
                for (let i = 0; i < allFilteredAssociates.length; i++) {
                  let x = allFilteredAssociates[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'year');

                    if (currentLoginDate.isBefore(endDate) || currentLoginDate.isSame(endDate)) {
                      filteredAssociates.push(x);
                    }
                  }
                }
                break;
            }
          }
        }

        if (this.filterAssociateData.selectedStates.length == 0 && this.filterAssociateData.selectedCities.length == 0 && this.filterAssociateData.selectedAssociate.length == 0 && this.filterAssociateData.selectedStatus.length == 0 && this.filterAssociateData.selectedLastLogins.length == 0) {
          this.objAssociate = this.objAllAssociate;
        }
        else {
          this.objAssociate = [...new Map(filteredAssociates.map((item: { [x: string]: any; }) => [item['Id'], item])).values()];
        }
      }
    }
  }

  onEmployeeFilterClick(): void {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    const modalRef = this.modalService.open(EmployeeFilterModalComponent, ngbModalOptions);
    modalRef.componentInstance.FilterEmployeeData = this.filterEmployeeData;

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.filterEmployeeData = receivedEntry;
      this.filterEmployee();
    });
  }

  filterEmployee() {
    var filteredEmployees = [];
    var resultData = [];

    if (this.objAllEmployees != null || this.objAllEmployees != undefined) {
      if (this.objAllEmployees.length > 0) {
        let allFilteredEmployees = this.objAllEmployees;

        //state filter
        for (let i = 0; i < this.filterEmployeeData.selectedStates.length; i++) {
          const element = this.filterEmployeeData.selectedStates[i];

          resultData = allFilteredEmployees.filter((x: any) => { return element.toLowerCase() == x.StateName.toLowerCase() });

          for (let k = 0; k < resultData.length; k++) {
            filteredEmployees.push(resultData[k]);
          }
        }

        //city filter
        var filteredCities = filteredEmployees;

        if (this.filterEmployeeData.selectedCities.length > 0) {
          filteredEmployees = [];
        }

        for (let i = 0; i < this.filterEmployeeData.selectedCities.length; i++) {
          const element = this.filterEmployeeData.selectedCities[i];

          if (filteredCities.length > 0) {
            resultData = filteredCities.filter((x: any) => { return element.toLowerCase() == x.CityName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredEmployees.filter((x: any) => { return element.toLowerCase() == x.CityName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
        }

        //associate filter
        var filteredAssociate = filteredEmployees;

        if (this.filterEmployeeData.selectedAssociate.length > 0) {
          filteredEmployees = [];
        }

        for (let i = 0; i < this.filterEmployeeData.selectedAssociate.length; i++) {
          const element = this.filterEmployeeData.selectedAssociate[i];

          if (filteredAssociate.length > 0) {
            resultData = filteredAssociate.filter((x: any) => { return element.toLowerCase() == x.AssociateName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredEmployees.filter((x: any) => { return element.toLowerCase() == x.AssociateName.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
        }

        //department filter
        var filteredDepartment = filteredEmployees;

        if (this.filterEmployeeData.selectedDepartment.length > 0) {
          filteredEmployees = [];
        }

        for (let i = 0; i < this.filterEmployeeData.selectedDepartment.length; i++) {
          const element = this.filterEmployeeData.selectedDepartment[i];

          if (filteredDepartment.length > 0) {
            resultData = filteredDepartment.filter((x: any) => { return x.DepartmentName.toLowerCase().includes(element.toLowerCase()) });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredEmployees.filter((x: any) => { return x.DepartmentName.toLowerCase().includes(element.toLowerCase()) });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
        }

        //grade filter
        var filteredGrade = filteredEmployees;

        if (this.filterEmployeeData.selectedGrade.length > 0) {
          filteredEmployees = [];
        }

        for (let i = 0; i < this.filterEmployeeData.selectedGrade.length; i++) {
          const element = this.filterEmployeeData.selectedGrade[i];

          if (filteredGrade.length > 0) {
            resultData = filteredGrade.filter((x: any) => { return element.toLowerCase() == x.Grade.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredEmployees.filter((x: any) => { return element.toLowerCase() == x.Grade.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
        }

        //employee filter
        var filteredEmployee = filteredEmployees;

        if (this.filterEmployeeData.selectedEmployee.length > 0) {
          filteredEmployees = [];
        }

        for (let i = 0; i < this.filterEmployeeData.selectedEmployee.length; i++) {
          const element = this.filterEmployeeData.selectedEmployee[i];

          if (filteredEmployee.length > 0) {
            resultData = filteredEmployee.filter((x: any) => { return element.toLowerCase() == x.Name.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredEmployees.filter((x: any) => { return element.toLowerCase() == x.Name.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
        }

        //account status filter
        var filteredStatus = filteredEmployees;

        if (this.filterEmployeeData.selectedStatus.length > 0) {
          filteredEmployees = [];
        }

        for (let i = 0; i < this.filterEmployeeData.selectedStatus.length; i++) {
          const element = this.filterEmployeeData.selectedStatus[i];

          if (filteredStatus.length > 0) {
            resultData = filteredStatus.filter((x: any) => { return element.toLowerCase() == x.LogMessage.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
          else {
            resultData = allFilteredEmployees.filter((x: any) => { return element.toLowerCase() == x.LogMessage.toLowerCase() });
            for (let k = 0; k < resultData.length; k++) {
              filteredEmployees.push(resultData[k]);
            }
          }
        }

        //last login filter
        var filteredLastLogin = filteredEmployees;

        if (this.filterEmployeeData.selectedLastLogins.length > 0) {
          filteredEmployees = [];
        }

        for (let i = 0; i < this.filterEmployeeData.selectedLastLogins.length; i++) {
          const element = this.filterEmployeeData.selectedLastLogins[i];

          if (filteredLastLogin.length > 0) {
            switch (element.toLowerCase()) {
              case 'not yet login':
                resultData = filteredLastLogin.filter((x: any) => { return x.LoginDate == null });
                for (let k = 0; k < resultData.length; k++) {
                  filteredEmployees.push(resultData[k]);
                }
                break;
              case 'less than 15 days':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() });
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case '15 days - 1 month':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days').subtract(1, 'month');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case '1 month - 3 months':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month').subtract(3, 'months');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case '3 months - 6 months':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months').subtract(6, 'months');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case '6 months - 1 year':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months').subtract(1, 'year');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case 'more than 1 year':
                for (let i = 0; i < filteredLastLogin.length; i++) {
                  let x = filteredLastLogin[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'year');

                    if (currentLoginDate.isBefore(endDate) || currentLoginDate.isSame(endDate)) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
            }
          }
          else {
            switch (element.toLowerCase()) {
              case 'not yet login':
                resultData = allFilteredEmployees.filter((x: any) => { return x.LoginDate == null });
                for (let k = 0; k < resultData.length; k++) {
                  filteredEmployees.push(resultData[k]);
                }
                break;
              case 'less than 15 days':
                for (let i = 0; i < allFilteredEmployees.length; i++) {
                  let x = allFilteredEmployees[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() });
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case '15 days - 1 month':
                for (let i = 0; i < allFilteredEmployees.length; i++) {
                  let x = allFilteredEmployees[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(15, 'days').subtract(1, 'month');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case '1 month - 3 months':
                for (let i = 0; i < allFilteredEmployees.length; i++) {
                  let x = allFilteredEmployees[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'month').subtract(3, 'months');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case '3 months - 6 months':
                for (let i = 0; i < allFilteredEmployees.length; i++) {
                  let x = allFilteredEmployees[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(3, 'months').subtract(6, 'months');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case '6 months - 1 year':
                for (let i = 0; i < allFilteredEmployees.length; i++) {
                  let x = allFilteredEmployees[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months');
                    let startDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(6, 'months').subtract(1, 'year');

                    if ((currentLoginDate.isBefore(endDate) && currentLoginDate.isAfter(startDate)) || (currentLoginDate.isSame(startDate) || currentLoginDate.isSame(endDate))) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
              case 'more than 1 year':
                for (let i = 0; i < allFilteredEmployees.length; i++) {
                  let x = allFilteredEmployees[i];
                  if (x.LoginDate != null) {
                    let objDate = new Date((new Date(x.LoginDate)).toISOString().slice(0, -1));
                    let objModelDate = this.dateAdapter.toModel({ year: objDate.getFullYear(), month: objDate.getMonth() + 1, day: objDate.getDate() });

                    var loginDateMonth: any;
                    loginDateMonth = this.dateAdapter.fromModel(objModelDate)?.month;
                    let currentLoginDate = moment({ y: this.dateAdapter.fromModel(objModelDate)?.year, M: loginDateMonth - 1, d: this.dateAdapter.fromModel(objModelDate)?.day });

                    let endDate = moment({ y: moment().year(), M: moment().month(), d: moment().day() }).subtract(1, 'year');

                    if (currentLoginDate.isBefore(endDate) || currentLoginDate.isSame(endDate)) {
                      filteredEmployees.push(x);
                    }
                  }
                }
                break;
            }
          }
        }

        if (this.filterEmployeeData.selectedStates.length == 0 && this.filterEmployeeData.selectedCities.length == 0 && this.filterEmployeeData.selectedAssociate.length == 0 && this.filterEmployeeData.selectedDepartment.length == 0 && this.filterEmployeeData.selectedGrade.length == 0 && this.filterEmployeeData.selectedEmployee.length == 0 && this.filterEmployeeData.selectedStatus.length == 0 && this.filterEmployeeData.selectedLastLogins.length == 0) {
          this.objEmployees = this.objAllEmployees;
        }
        else {
          this.objEmployees = [...new Map(filteredEmployees.map((item: { [x: string]: any; }) => [item['Id'], item])).values()];
        }
      }
    }
  }

  onAssociateViewDetails(row: any) {
    this.associateMode = this.appCryptoService.ParamEncrypt('viewdetails');
    this.router.navigate(['associate-generalinfo/' + row.Id + '/' + this.associateMode]);
  }


  onEmployeeViewDetails(row: any) {
    this.router.navigate(['employee-general-information/' + row.Id + '/' + this.appCryptoService.ParamEncrypt('viewdetails')]);
  }

  onEmployeeUpdate(row: any) {
    this.employeeMode = this.appCryptoService.ParamEncrypt('edit');
    this.employeeService.GetEmployeeGeneralInfoById(row.Id).subscribe((sresult) => {
      if (sresult.Status == true) {

        let isSelfVerified = sresult.Data.IsSelfVerified;
        if (isSelfVerified == true) {
          this.router.navigate(['employee-download/' + row.Id + '/' +  this.employeeMode]);
        }
        else {
          this.router.navigate(['employee-general-information/' + row.Id + '/' +  this.employeeMode]);
        }
      }
    });
  }

    onAssociateViewLogs(row: any) {
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      };
      const modalRef = this.modalService.open(AssociateLogModalComponent, ngbModalOptions);
      modalRef.componentInstance.AssociateId = row.Id;
      modalRef.componentInstance.AssociateName = row.AssociateName;
    }

    onSort(event: any) {
    }

    onEmployeeViewLogs(row: any) {
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      };
      const modalRef = this.modalService.open(EmployeeLogsTemplateComponent, ngbModalOptions);
      modalRef.componentInstance.EmployeeId = row.Id;
      modalRef.componentInstance.EmployeeName = row.Name;
    }

    onAssociateUpdate(row: any) {
      this.associateMode = this.appCryptoService.ParamEncrypt('edit');
      // this.router.navigate(['associate-generalinfo/' + row.Id + '/' + this.associateMode]);
      this.associateService.GetAssociateGeneralInfoByAssociateId(row.Id).subscribe((sresult) => {
        if (sresult.Status == true) {
          let isSelfVerified = sresult.Data.IsSelfVerified;

          if (isSelfVerified == true) {
            this.router.navigate(['associate-download/' + row.Id + '/' + this.associateMode]);
          }
          else {
            this.router.navigate(['associate-generalinfo/' + row.Id + '/' + this.associateMode]);
          }
        }
      });
    }

    onEmployeeResetPassword(row: any) {


      let EmployeeResetPasswordData = {
        EmployeeId: row.Id,
        Device: this.deviceInfo.deviceType + " " + this.deviceInfo.os,
        Browser: this.deviceInfo.browser,
        IpAddress: (this.address == null) ? '' :this.address,
      }
      this.employeeService.SendEmployeeResetPasswordLink(EmployeeResetPasswordData).subscribe((result) => {
        if (result.Status) {
          var EmployeeResetPasswordId = result.Data.Id
          // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          // this.router.onSameUrlNavigation = 'reload';
          // this.router.navigate(['/forgot-password-success']);
        }
      });
    }


    onAssociateResetPassword(row: any) {


      let AssociateResetPasswordData = {
        AssociateId: row.Id,
        Device: this.deviceInfo.deviceType + " " + this.deviceInfo.os,
        Browser: this.deviceInfo.browser,
        IpAddress: (this.address == null) ? '' :this.address,
      }
      this.associateService.SendAssociateResetPasswordLink(AssociateResetPasswordData).subscribe((result) => {
        if (result.Status) {
          var AssociateResetPasswordId = result.Data.Id
          // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          // this.router.onSameUrlNavigation = 'reload';
          // this.router.navigate(['/forgot-password-success']);
        }
      });
    }

    onDeactivate(row: any) {
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      };
      const modalRef = this.modalService.open(AssociateGeneralinfoComponent, ngbModalOptions);
      modalRef.componentInstance.AssociateId = row.Id;
    }

    onNewAssociateClicked() {
      this.associateMode = this.appCryptoService.ParamEncrypt('create');
      this.router.navigate(['associate-generalinfo/414E2B5048745659672B513D/' + this.associateMode]);
    }

    onNewEmployeeClicked() {
      this.router.navigate(['employee-general-information/414E2B5048745659672B513D/' + this.appCryptoService.ParamEncrypt('create')]);
    }

    employeeExcel() {
      this.employeeService.GetEmployeeExcelData().subscribe((result) => {
        if (result.Status == true) {
          var fileName = result.Data.FileName;
          var url = environment.BASE_API_URL + '/doc/report/' + fileName;
          const a = document.createElement('a');
          a.href = url.toString();
          a.download = fileName;
          a.click();

        }

      });
    }

    associateExcel() {
      this.associateService.GetAssociateExcelData().subscribe((result) => {
        if (result.Status == true) {
          var fileName = result.Data.FileName;
          var url = environment.BASE_API_URL + '/doc/report/' + fileName;
          const a = document.createElement('a');
          a.href = url.toString();
          a.download = fileName;
          a.click();

        }

      });
    }
  }


