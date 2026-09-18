import { Directive, ElementRef, Input, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appInputRestriction]',
  standalone: true
})
export class AppInputRestrictionDirective {
  private inputElement = inject(ElementRef);

  @Input('appInputRestriction') appInputRestriction: any;
  arabicRegex = '[\u0600-\u06FF]';

  // constructor(el: ElementRef) {
  //   this.inputElement = el;
  // }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    if (this.appInputRestriction === 'integer') {
      this.integerOnly(event);
    } else if (this.appInputRestriction === 'noSpecialChars') {
      this.noSpecialChars(event);
    }
    else if (this.appInputRestriction === 'onlyChars') {
      this.onlyChars(event);
    }
    else if (this.appInputRestriction === 'allowDecimal') {
      this.allowDecimal(event);
    }
  }

  integerOnly(event: KeyboardEvent) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && e.ctrlKey === true)) {
      // let it happen, don't do anything
      return;
    }
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
      e.preventDefault();
    }
  }

  noSpecialChars(event: KeyboardEvent) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    let k;
    k = event.keyCode;  // k = event.charCode;  (Both can be used)
    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57)) {
      return;
    }
    const ch = String.fromCharCode(e.keyCode);
    const regEx = new RegExp(this.arabicRegex);
    if (regEx.test(ch)) {
      return;
    }
    e.preventDefault();
  }

  onlyChars(event: KeyboardEvent) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    let k;
    k = event.keyCode;  // k = event.charCode;  (Both can be used)
    if ((k > 64 && k < 91) || k === 8 || k === 32 || (k > 96 && k < 124)) {
      return;
    }
    // const ch = String.fromCharCode(e.keyCode);
    // const regEx = new RegExp(this.arabicRegex);
    // if (regEx.test(ch)) {
    //   return;
    // }
    e.preventDefault();
  }

  allowDecimal(event: KeyboardEvent) {
    const e = <KeyboardEvent>event;

    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }

    let k;

    k = event.keyCode;  // k = event.charCode;  (Both can be used)

    if ((k == 48) || (k == 49) || (k == 50) || (k == 51) ||
      (k == 52) || (k == 53) || (k == 54) || (k == 55) ||
      (k == 56) || (k == 57)) {
      var arcontrol = new Array();
      var temp = this.inputElement.nativeElement.value;
      arcontrol = this.inputElement.nativeElement.value.split(".");

      if (arcontrol.length == 1) {
        if (arcontrol[0].length < 16) {
          // event.returnValue=true;
          return;
        }
        else {
          // event.returnValue=false;
          // e.preventDefault();
        }
      }
      else {
        return;
      }
    }
    else if (k == 46) {
      var sCount = new Array();
      sCount = this.inputElement.nativeElement.value.split(".");

      if ((sCount.length) - 1 == 1) {
        // event.returnValue=false;
        // e.preventDefault();
      }
      else {
        // event.returnValue=true;
        return;
      }
    }

    e.preventDefault();
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    let regex: any;
    if (this.appInputRestriction === 'integer') {
      regex = /[0-9]/g;
    } else if (this.appInputRestriction === 'noSpecialChars') {
      regex = /[a-zA-Z0-9\u0600-\u06FF]/g;
    } else if (this.appInputRestriction === 'onlyChars') {
      regex = /^[a-zA-Z]+$/;
    }
    const e = <ClipboardEvent>event;
    const pasteData = e.clipboardData!.getData('text/plain');
    let m;
    let matches = 0;
    while ((m = regex.exec(pasteData)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      // The result can be accessed through the `m`-variable.
      m.forEach((match: any, groupIndex: any) => {
        matches++;
      });
    }
    if (matches === pasteData.length) {
      return;
    } else {
      e.preventDefault();
    }
  }

}
