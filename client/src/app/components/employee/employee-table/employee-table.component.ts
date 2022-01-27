import { Component, OnDestroy, OnInit } from '@angular/core';
import { concatMap, takeUntil } from 'rxjs/operators';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { Office } from '../../../models/office';
import { EmployeeService } from '../../../services/employee.service';
import { OrdinaryDisplayColumn } from '../../../models/ordinary-display-column';
import { Employee } from '../../../models/employee';
import { MatDialog } from '@angular/material/dialog';
import { OfficeService } from '../../../services/office.service';
import { TagService } from '../../../services/tag.service';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})
export class EmployeeTableComponent implements OnInit, OnDestroy {

  requestedColumns: OrdinaryDisplayColumn[] = [
    {
      headerTitle: 'ID',
      columnDef: 'id',
      columnValue: 'id'
    },
    {
      headerTitle: 'First name',
      columnDef: 'firstName',
      columnValue: 'first_name'
    },
    {
      headerTitle: 'Last name',
      columnDef: 'lastName',
      columnValue: 'last_name'
    },
    {
      headerTitle: 'Office',
      columnDef: 'officeName',
      columnValue: 'office_name'
    },
    {
      headerTitle: 'Birthdate',
      columnDef: 'birthdate',
      columnValue: 'birthdate'
    },
    {
      headerTitle: 'Phone number',
      columnDef: 'phoneNumber',
      columnValue: 'phone_number'
    },
    {
      headerTitle: 'Tags',
      columnDef: 'tags',
      columnValue: 'tag_names'
    }
  ];

  destroyStream$: Subject<void> = new Subject<void> ();

  data$: Observable<Employee[]> = new Observable<Employee[]>();

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private officeService: OfficeService,
    private tagService: TagService
  ) { }

  ngOnInit(): void {
    this.data$ = this.getTable();
  }

  ngOnDestroy() {
    this.destroyStream$.next();
  }

  openDialog(action: string, id?: number): void {
    let form: any = [];
    let dialogRef;
    if (action === 'Add' || action === 'Edit') {
      let offices = this.officeService.getList();
      let tags = this.tagService.getList();
      let data: Observable<Employee | null> = of(null);
      if (action === 'Edit' && id) {
        data = this.employeeService.getEmployeeById(id);
      }
      forkJoin([offices, tags, data]).subscribe(res => {
        const oldData: any = res[2];
        form = [
          { label: "First name", controlName: "firstName", type: "input", value: oldData?.first_name || "", validators: ['required'] },
          { label: "Last name", controlName: "lastName", type: "input", value: oldData?.last_name || "", validators: ['required'] },
          { label: "Office", controlName: "officeId", type: "select", value: oldData?.office_id || "", options: res[0], validators: ['required'] },
          { label: "Birthdate", controlName: "birthdate", type: "date", value: oldData?.birthdate || "", validators: ['required'] },
          { label: "Phone number", controlName: "phoneNumber", type: "input", value: oldData?.phone_number || "", validators: ['required', { name: 'regexp', pattern: '^\\+?[0-9]+$' }]  },
          { label: "Tags", controlName: "tags", type: "multipleSelect", value: oldData?.tags || "", options: res[1] }
        ];
        dialogRef = this.dialog.open(DialogComponent, {
          width: '350px',
          data: { form, action }
        });
        dialogRef.afterClosed()
          .pipe(
            takeUntil(this.destroyStream$)
          )
          .subscribe(result => {
            if (result.event === 'Cancel') {
              return;
            }
            if (result.event == 'Add') {
              this.addEmployee(result.data);
            } else if(result.event == 'Edit') {
              this.editEmployee({
                data: result.data,
                oldData
              });
            }
          });
      })
    } else if (action === 'Delete') {
      dialogRef = this.dialog.open(DialogComponent, {
        width: '350px',
        data: { form, action }
      });
      dialogRef.afterClosed()
        .pipe(
          takeUntil(this.destroyStream$)
        )
        .subscribe(result => {
          if (result.event === 'Cancel') {
            return;
          } else {
            if (id !== undefined) {
              this.deleteEmployee(id);
            }
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

  getTable(): Observable<Employee[]> {
    return this.employeeService.getList()
      .pipe(
        takeUntil(this.destroyStream$),

      )
  }

  addEmployee(data: Employee) {
    this.data$ = this.employeeService
      .addEmployee(data)
      .pipe(
        concatMap((res) => {
          return this.getTable();
        })
      );
  }

  editEmployee(data: any) {
    this.data$ = this.employeeService
      .editEmployee(data)
      .pipe(
        concatMap((res) => {
          return this.getTable();
        })
      );
  }

  deleteEmployee(id: number) {
    this.data$ = this.employeeService
      .deleteEmployee(id)
      .pipe(
        concatMap((res) => {
          return this.getTable();
        })
      );
  }
}
