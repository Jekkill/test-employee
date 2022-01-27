import { Component,  Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  action: string;
  localData: any;
  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.localData = {...data};
    this.action = this.localData.action;
  }

  ngOnInit(): void {
    for (let formElement of this.localData.form) {
      if (formElement.type === 'multipleSelect') {
        if (formElement.value === null) {
          formElement.value = [];
        } else {
          formElement.value = formElement.value.split(',').map((elem: string) => parseInt(elem));
        }
      }
      const validators = [];
      if (formElement.validators && formElement.validators.length > 0) {
        if (formElement.validators.indexOf('required') !== -1) {
          validators.push(Validators.required);
        }
        const regExpValidator = formElement.validators.find((elem: any) => elem.name === 'regexp');
        if (regExpValidator) {
          validators.push(Validators.pattern(regExpValidator.pattern));
        }
      }
      this.form.addControl(formElement.controlName, this.fb.control(formElement.value, validators) );
    }
  }

  doAction() {
    this.dialogRef.close({ event:this.action, data: this.form.value });
  }

  closeDialog() {
    this.dialogRef.close({ event:'Cancel' });
  }

}
