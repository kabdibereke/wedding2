import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import XLSX from 'xlsx-js-style';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { GuestService } from '../../services/main-page.service';
import { TableData } from './table.types';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  public columns: string[] = ['ID', 'Имя', 'Пожелание', 'Результат'];
  public data: TableData[] = [];
  public destroyRef = inject(DestroyRef);

  constructor(private readonly _guestService: GuestService) {}

  public ngOnInit(): void {
    this._guestService
      .getGuestsList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        this.data = values.map((value, index) => {
          return {
            pos: index + 1,
            ...value,
          } as unknown as TableData;
        });
      });
  }

  public deleteGuest(id: string): void {
    let result = confirm('Удалить элемент?');
    if(result) {
         this._guestService
      .deleteGuest(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({});
    };
 
  }

  public exportExcel(): void {
    let element = document.getElementById('excel-table');

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    for (let i in ws) {
      if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);
      console.log(ws[i]);
      if (ws[i].v == 'удалить') {
        delete ws[i];
        continue;
      }

      ws[i].s = {
        font: {
          name: 'arial',
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
          wrapText: '1',
        },
        border: {
          right: {
            style: 'thin',
            color: '000000',
          },
          left: {
            style: 'thin',
            color: '000000',
          },
        },
      };

      if (cell.r == 0) {
        ws[i].s.border.bottom = {
          style: 'thin',
          color: '000000',
        };
      }

      if (cell.r % 2) {
        ws[i].s.fill = {
          patternType: 'solid',
          fgColor: { rgb: 'b2b2b2' },
          bgColor: { rgb: 'b2b2b2' },
        };
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Гости.xlsx');
  }
}
