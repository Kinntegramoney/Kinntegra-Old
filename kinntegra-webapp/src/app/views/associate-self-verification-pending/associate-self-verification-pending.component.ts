import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCryptoService } from '../../services/app-crypto.service';
import { AssociateService } from '../../services/associate.service';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, provideLottieOptions, AnimationLoader, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-associate-self-verification-pending',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './associate-self-verification-pending.component.html',
  styleUrl: './associate-self-verification-pending.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader,AssociateService, AppCryptoService]
})

export class AssociateSelfVerificationPendingComponent implements OnInit{
  associateId!: any;
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
  }

  onOkClick(){
    let inputData = {
      AssociateId: this.associateId
    }
    this.associateService.ResendAssociateSelfVerificationEmail(inputData).subscribe((result) => {
      if (result.Status) {
        // var AssociateId = result.Data.Id;
      }
    });
  }

  animationCreated(animationItem: AnimationItem): void {
  }
}
