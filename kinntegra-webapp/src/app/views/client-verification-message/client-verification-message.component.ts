import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnimationItem } from 'lottie-web';
import { provideLottieOptions, AnimationLoader, AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AppCryptoService } from '../../services/app-crypto.service';
import { ClientService } from '../../services/client.service';
import { EmployeeService } from '../../services/employee.service';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';


@Component({
  selector: 'app-client-verification-message',
  standalone: true,
  imports: [HttpClientModule, LottieComponent, CommonModule, FormsModule],
  templateUrl: './client-verification-message.component.html',
  styleUrl: './client-verification-message.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, ClientService, AppCryptoService]
})
export class ClientVerificationMessageComponent implements OnInit {
  clientId!: any;
  mode!: any;
  mtype!:any;
  objClient!: any
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
    private clientService: ClientService,
    private appCryptoService: AppCryptoService,
  ) {
  }

  ngOnInit() {
    this.clientId = this.activatedroute.snapshot.paramMap.get('clientid');
    this.mode = (this.activatedroute.snapshot.paramMap.get('mode') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mode')) : null);
    this.mtype = (this.activatedroute.snapshot.paramMap.get('mtype') != null ? this.appCryptoService.ParamDecrypt(this.activatedroute.snapshot.paramMap.get('mtype')) : null);

    if (this.mode == 'create') {
      this.showSupervisor = true;
      this.showSelf = false;
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
    this.objClient = {
      Id: '414E2B5048745659672B513D',
      ClientId: this.clientId,
      FamilyName: ''
    }

    if (this.clientId != null && this.clientId.toUpperCase() != '414E2B5048745659672B513D') {
      this.getClient();
    }
  }

  getClient() {
    this.clientService.GetClientById(this.clientId).subscribe((result) => {
      if (result.Status == true) {
        this.objClient = result.Data;
      }
    });
  }
}
