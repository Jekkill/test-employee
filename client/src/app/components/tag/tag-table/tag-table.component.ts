import { Component, OnDestroy, OnInit } from '@angular/core';
import { TagService } from '../../../services/tag.service';
import { Observable, Subject } from 'rxjs';
import { Tag } from '../../../models/tag';
import { concatMap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { OrdinaryDisplayColumn } from '../../../models/ordinary-display-column';
import {Office} from "../../../models/office";
import {OfficeService} from "../../../services/office.service";

@Component({
  selector: 'app-tag-table',
  templateUrl: './tag-table.component.html',
  styleUrls: ['./tag-table.component.css']
})
export class TagTableComponent implements OnInit {

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

  data$: Observable<Tag[]> = new Observable<Tag[]>();
  destroyStream$: Subject<void> = new Subject<void> ();

  constructor(
    private tagService: TagService,
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
      this.tagService
        .getTagById(id)
        .pipe(
          takeUntil(this.destroyStream$),
          concatMap(res => {
            form = [
              { label: "Name", controlName: "name", type: "input", value: res.name, validators: ['required'] }
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
          this.updateTag({ ...result.data, id });
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
            this.addTag(result.data);
          } else if(result.event == 'Delete') {
            if (id !== undefined) {
              this.deleteTag(id);
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

  addTag(data: Tag): void {
    this.data$ = this.tagService
      .addTag(data)
      .pipe(
        concatMap((res) => {
          return this.getTable();
        })
      );
  }

  updateTag(data: any): void {
    this.data$ = this.tagService
      .updateTag(data)
      .pipe(
        concatMap(res => {
          return this.getTable();
        })
      );
  }

  deleteTag(id: number): void {
    this.data$ = this.tagService
      .deleteTag(id)
      .pipe(
        concatMap(res => {
          return this.getTable();
        })
      );
  }

  getTable(): Observable<Tag[]> {
    return this.tagService.getList()
      .pipe(
        takeUntil(this.destroyStream$)
      );
  }

}
