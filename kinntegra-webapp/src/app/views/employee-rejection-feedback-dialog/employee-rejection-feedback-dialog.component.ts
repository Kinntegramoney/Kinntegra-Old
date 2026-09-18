import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-employee-rejection-feedback-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, HttpClientModule, NgbModule],
  templateUrl: './employee-rejection-feedback-dialog.component.html',
  styleUrl: './employee-rejection-feedback-dialog.component.scss'
})
export class EmployeeRejectionFeedbackDialogComponent {

}
