import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalOptions, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-document-preview-modal',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './document-preview-modal.component.html',
  styleUrl: './document-preview-modal.component.scss',
  providers: []
})
export class DocumentPreviewModalComponent implements OnInit {
  @Input() FileName: any;
  @Input() FileContent: any;
  @Input() FileType: any;
  @Input() FileUrl: any;
  documentUrl: any;
  IsImageFile: boolean = true;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.IsImageFile = this.FileType.includes('image');

    if (this.FileUrl == null) {
      this.pepareDocumentFileUrl();
    }
    else {
      this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.FileUrl);
    }
  }

  pepareDocumentFileUrl() {
    let TYPED_ARRAY = new Uint8Array(this.FileContent.data);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);

    let objectUrl = 'data:' + this.FileType + ';base64,' + base64String;
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
  }

  onDonwload() {
    let TYPED_ARRAY = new Uint8Array(this.FileContent.data);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);

    let objectUrl = 'data:' + this.FileType + ';base64,' + base64String;

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = this.FileName;
    a.click();

    URL.revokeObjectURL(objectUrl);
  }
}
