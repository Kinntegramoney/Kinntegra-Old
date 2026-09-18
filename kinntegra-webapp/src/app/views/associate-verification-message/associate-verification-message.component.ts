import { Component } from '@angular/core';
import { AssociateService } from '../../services/associate.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule, } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-associate-verification-message',
  standalone: true,
  imports: [HttpClientModule, LottieComponent, CommonModule, FormsModule],
  templateUrl: './associate-verification-message.component.html',
  styleUrl: './associate-verification-message.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, AssociateService, AppCryptoService]
})
export class AssociateVerificationMessageComponent {
  associateId!: any;
  mode!: any;
  objVerfication!: any
  showSupervisor!: any;
  showSelf!: any;
  modeName!: any;
  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/success.json',
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedroute: ActivatedRoute,
    private associateService: AssociateService,
    private appCryptoService: AppCryptoService,

  ) {
  }

  ngOnInit() {
    this.associateId = this.activatedroute.snapshot.paramMap.get('associateid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);

    if (this.mode == 'create') {
      this.showSupervisor = true;
      this.showSelf = false
      this.modeName = 'Created';
    }
    else if (this.mode == 'edit') {
      this.showSupervisor = true;
      this.showSelf = false;
      this.modeName = 'Updated';
    }
    else if (this.mode == 'verify') {
      this.showSupervisor = false;
      this.showSelf = true;
    }
    this.onRefresh();
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  onRefresh() {
    this.objVerfication = {
      Id: '414E2B5048745659672B513D',
      AssociateId: this.associateId,
      Name: ''
    }

    if (this.associateId != null && this.associateId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getAssociateGeneralInfoById(this.associateId);
    }
  }


  getAssociateGeneralInfoById(asstId: any) {
    this.associateService.GetAssociateGeneralInfoByAssociateId(asstId).subscribe((result) => {
      if (result.Status == true) {
        if (result.Data != undefined) {
          this.objVerfication = result.Data;
        }
      }
    });
  }
}
