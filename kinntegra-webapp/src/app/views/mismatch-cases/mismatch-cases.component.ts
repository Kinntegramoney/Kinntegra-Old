import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbNavModule, NgbDropdown, NgbDropdownModule, NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Apperrormessage } from '../../models/apperrormessage';
import { MismatchCasesService } from '../../services/mismatch-cases.service';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';

@Component({
  selector: 'app-mismatch-cases',
  standalone: true,
  imports: [HeaderRightTemplateComponent, NgbNavModule, NgxDatatableModule, CommonModule, FormsModule, NgbDropdownModule, HttpClientModule, NgbModule, NgSelectModule],
  templateUrl: './mismatch-cases.component.html',
  styleUrl: './mismatch-cases.component.scss',
  providers: [MismatchCasesService]
})
export class MismatchCasesComponent implements OnInit {
  appErrors!: Apperrormessage[];
  ColumnMode = ColumnMode;
  // SelectionType = SelectionType;
  activeTab: number = 1;
  objSearchKeyword: string = '';
  objMismatchPanList: any = [];
  objMismatchNameAllowedList: any = [];
  objMismatchNameNotAllowedList: any = [];
  objMissingPanList: any = [];
  objMismatchPanListAll: any = [];
  objMismatchNameAllowedListAll: any = [];
  objMismatchNameNotAllowedListAll: any = [];
  objMissingPanListAll: any = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private mismatchCasesService: MismatchCasesService,
  ) { }

  ngOnInit(): void {
    this.getMismatchPanList();
    this.getMismatchNameAllowedList();
    this.getMismatchNameNotAllowedList();
    this.getMissingPanList();
  }

  getMismatchPanList() {
    this.mismatchCasesService.GetFeedMismatchedCasesByCaseCode('1,2').subscribe((result) => {
      if (result.Status == true) {
        this.objMismatchPanList = result.Data.map((item: any) => {
          let SelectedFolio = null;
          if (item.FolioLists.length == 1) {
            SelectedFolio = item.FolioLists[0];
          }
          const FirstHolderTooltip = `Pan: ${item.FirstHolderPan}`;
          const SecondHolderTooltip = `Pan: ${item.SecondHolderPan}`;
          const ThirdHolderTooltip = `Pan: ${item.ThirdHolderPan}`;
          const GuardianTooltip = `Pan: ${item.GuardianPan}`;
          return { ...item, SelectedFolio, FirstHolderTooltip, SecondHolderTooltip, ThirdHolderTooltip, GuardianTooltip }
        });

        this.objMismatchPanListAll = this.objMismatchPanList;
      }
    });
  }

  getMismatchNameAllowedList() {
    this.mismatchCasesService.GetFeedMismatchedCasesByCaseCode('4').subscribe((result) => {
      if (result.Status == true) {
        this.objMismatchNameAllowedList = result.Data.map((item: any) => {
          let SelectedFolio = null;
          if (item.FolioLists.length == 1) {
            SelectedFolio = item.FolioLists[0];
          }
          const FirstHolderTooltip = `Pan: ${item.FirstHolderPan}`;
          const SecondHolderTooltip = `Pan: ${item.SecondHolderPan}`;
          const ThirdHolderTooltip = `Pan: ${item.ThirdHolderPan}`;
          const GuardianTooltip = `Pan: ${item.GuardianPan}`;
          return { ...item, SelectedFolio, FirstHolderTooltip, SecondHolderTooltip, ThirdHolderTooltip, GuardianTooltip }
        });

        this.objMismatchNameAllowedListAll = this.objMismatchNameAllowedList;
      }
    });
  }

  getMismatchNameNotAllowedList() {
    this.mismatchCasesService.GetFeedMismatchedCasesByCaseCode('5').subscribe((result) => {
      if (result.Status == true) {
        this.objMismatchNameNotAllowedList = result.Data.map((item: any) => {
          let SelectedFolio = null;
          if (item.FolioLists.length == 1) {
            SelectedFolio = item.FolioLists[0];
          }
          const FirstHolderTooltip = `Pan: ${item.FirstHolderPan}`;
          const SecondHolderTooltip = `Pan: ${item.SecondHolderPan}`;
          const ThirdHolderTooltip = `Pan: ${item.ThirdHolderPan}`;
          const GuardianTooltip = `Pan: ${item.GuardianPan}`;
          return { ...item, SelectedFolio, FirstHolderTooltip, SecondHolderTooltip, ThirdHolderTooltip, GuardianTooltip }
        });

        this.objMismatchNameNotAllowedListAll = this.objMismatchNameNotAllowedList;
      }
    });
  }

  getMissingPanList() {
    this.mismatchCasesService.GetFeedMismatchedCasesByCaseCode('3').subscribe((result) => {
      if (result.Status == true) {
        this.objMissingPanList = result.Data.map((item: any) => {
          let SelectedFolio = null;
          if (item.FolioLists.length == 1) {
            SelectedFolio = item.FolioLists[0];
          }
          const FirstHolderTooltip = `Pan: ${item.FirstHolderPan}`;
          const SecondHolderTooltip = `Pan: ${item.SecondHolderPan}`;
          const ThirdHolderTooltip = `Pan: ${item.ThirdHolderPan}`;
          const GuardianTooltip = `Pan: ${item.GuardianPan}`;
          return { ...item, SelectedFolio, FirstHolderTooltip, SecondHolderTooltip, ThirdHolderTooltip, GuardianTooltip }
        });

        this.objMissingPanListAll = this.objMissingPanList;
      }
    });
  }

  searchClientRecord(): void {
    switch (this.activeTab) {
      case 1:
        let filterResult1 = this.objMismatchPanListAll;

        filterResult1 = filterResult1.filter((res: any) => {
          return res.SubBrokerCode.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objMismatchPanList = [...filterResult1];
        break;
      case 2:
        let filterResult2 = this.objMismatchNameAllowedListAll;

        filterResult2 = filterResult2.filter((res: any) => {
          return res.SubBrokerCode.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objMismatchNameAllowedList = [...filterResult2];
        break;
      case 3:
        let filterResult3 = this.objMismatchNameNotAllowedListAll;

        filterResult3 = filterResult3.filter((res: any) => {
          return res.SubBrokerCode.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objMismatchNameNotAllowedList = [...filterResult3];
        break;
      case 4:
        let filterResult4 = this.objMissingPanListAll;

        filterResult4 = filterResult4.filter((res: any) => {
          return res.SubBrokerCode.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianName.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.FirstHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.SecondHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.ThirdHolderPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim()) ||
            res.GuardianPan.toLowerCase().match(this.objSearchKeyword.toLowerCase().trim());
        });
        this.objMissingPanList = [...filterResult4];
        break;
    }
  }
}
