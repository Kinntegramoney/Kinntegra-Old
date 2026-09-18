import { Injectable } from "@angular/core";
import { NgbDateAdapter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CustomNgbDateAdapter extends NgbDateAdapter<string> {
    readonly DELIMITER = '-';

    fromModel(value: string | null): NgbDateStruct | null {
        if (value) {
            let date = value.split(this.DELIMITER);
            return {
                day: parseInt(date[0], 10),
                month: parseInt(date[1], 10),
                year: parseInt(date[2], 10)
            };
        }
        return null;
    }

    toModel(date: NgbDateStruct | null): string | null {
        return date ? ((date.day < 10) ? '0' + date.day.toString() : date.day) + this.DELIMITER + ((date.month < 10) ? '0' + date.month.toString() : date.month) + this.DELIMITER + date.year : null;
    }
}