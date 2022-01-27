import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfficeService } from '../../../services/office.service';
import { Observable, Subject } from 'rxjs';
import { Office } from '../../../models/office';
import { concatMap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { OrdinaryDisplayColumn } from '../../../models/ordinary-display-column';

@Component({
  selector: 'app-office-table',
  templateUrl: './office-table.component.html',
  styleUrls: ['./office-table.component.css']
})
export class OfficeTableComponent implements OnInit, OnDestroy {
  requestedColumns: OrdinaryDisplayColumn[] = [
    {
      headerTitle: 'ID',
      columnDef: 'id',
      columnValue: 'id'
    },
    {
      headerTitle: 'Name',
      columnDef: 'name',
      columnValue: 'name'
    }
  ];

  data$: Observable<Office[]> = new Observable<Office[]>();
  destroyStream$: Subject<void> = new Subject<void> ();

  constructor(
    private officeService: OfficeService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
      this.data$ = this.getTable();
  }

  ngOnDestroy(): void {
    this.destroyStream$.next();
  }

  openDialog(action: string, id?: number): void {
    let form: any = [];
    let dialogRef;
    // special case for the edit action -> before opening dialog get data from the server;
    if (action === 'Edit') {
      if (!id) {
        return;
      }
      this.officeService
        .getOfficeById(id)
        .pipe(
          takeUntil(this.destroyStream$),
          concatMap(res => {
            form = [
              { label: "Name", controlName: "name", type: "input", value: res.name,  validators: ['required'] }
            ];
            dialogRef = this.dialog.open(DialogComponent, {
              width: '300px',
              data: { form, action }
            });
            return dialogRef.afterClosed();
          })
        )
        .subscribe((result) => {
          if (result.event === 'Cancel') {
            return;
          }
          this.updateOffice({ ...result.data, id });
        });
    } else {
      if (action === 'Add') {
        form = [
          { label: "Name", controlName: "name", type: "input", value: "", validators: ['required'] }
        ];
      }
      dialogRef = this.dialog.open(DialogComponent, {
        width: '300px',
        data: { form, action }
      });
      dialogRef.afterClosed()
        .pipe(
          takeUntil(this.destroyStream$)
        )
        .subscribe(result => {
          if(result.event == 'Add') {
            this.addOffice(result.data);
          } else if(result.event == 'Delete') {
            this.deleteOffice(id);
          }
        });
    }
  }

  handleActionCall(e: any): void {
    if (e.action === 'Delete') {
      this.openDialog(e.action, e.id);
    } else {
      this.openDialog(e.action, e.id);
    }
  }

  addOffice(data: Office): void {
    this.data$ = this.officeService
      .addOffice(data)
        .pipe(
          concatMap((res) => {
            return this.getTable();
          })
        );
  }

  updateOffice(data: any): void {
    this.data$ = this.officeService
      .updateOffice(data)
        .pipe(
          concatMap(res => {
            return this.getTable();
          })
        );
  }

  deleteOffice(data: any): void {
    this.data$ = this.officeService
      .deleteOffice(data)
        .pipe(
          concatMap(res => {
            return this.getTable();
          })
        );
  }

  getTable(): Observable<Office[]> {
    return this.officeService.getList()
              .pipe(
                takeUntil(this.destroyStream$)
              );
  }

}
