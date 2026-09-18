import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModalOptions, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnimationItem } from 'lottie-web';
import { provideLottieOptions, AnimationLoader, AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AppGlobalService } from '../../services/app-global.service';
import { AppStorageService } from '../../services/app-storage.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-order-progress-modal',
  standalone: true,
  imports: [LottieComponent, CommonModule],
  templateUrl: './order-progress-modal.component.html',
  styleUrl: './order-progress-modal.component.scss',
  providers: [
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    AnimationLoader, NotificationService, AppStorageService
  ]
})
export class OrderProgressModalComponent {
  StatusMessage: string = 'Validating client credentials...';
  ShowTryAgain: boolean = false;
  ShowFinalStatus: boolean = false;

  lottieOptions: AnimationOptions = {
    path: 'assets/lottiefiles/progress.json',
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.notificationService.GetRealCommunicationOrderProgress().subscribe((message: any) => {
      var notificationData = JSON.parse(message);

      if (notificationData.ReceiverId == AppGlobalService.CurrentUserId) {
        this.StatusMessage = notificationData.StatusMessage;
        this.ShowTryAgain = !notificationData.Status;
        this.ShowFinalStatus = (notificationData.RecordType === 'Order Progress Complete');
      }
    });
  }

  onClose() {
    this.modalService.dismissAll();
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }
}
