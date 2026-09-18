import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-associate-rejection-feedback-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule],
  templateUrl: './associate-rejection-feedback-dialog.component.html',
  styleUrl: './associate-rejection-feedback-dialog.component.scss'
})
export class AssociateRejectionFeedbackDialogComponent {

}
