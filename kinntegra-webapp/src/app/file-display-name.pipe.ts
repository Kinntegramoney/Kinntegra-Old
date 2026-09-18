import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileDisplayName',
  standalone: true
})
export class FileDisplayNamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    let fileParts = value.split('.');
    let ext = fileParts[fileParts.length - 1];
    let fileName = ''
    let formattedFileName = '';

    for (let i = 0; i < fileParts.length - 1; i++) {
      fileName += fileParts[i];
    }

    if (fileName.length <= 6) {
      formattedFileName = "..." + fileName;
    }
    else {
      formattedFileName = "..." + fileName.substring(fileName.length - 6);
    }

    return formattedFileName + '.' + ext;
  }

}
