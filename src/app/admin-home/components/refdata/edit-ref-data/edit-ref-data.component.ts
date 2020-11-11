import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-ref-data',
  templateUrl: './edit-ref-data.component.html',
  styleUrls: ['./edit-ref-data.component.css']
})
export class EditRefDataComponent implements OnInit {

  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  
  editFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.editFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
      currencyCode: ['', Validators.required],
      rentPeriod: ['', Validators.required]
     });
   }

  ngOnInit(): void {
  }

  updateRefData() {
    this.update.emit();
  }

  cancelButton() {
    this.cancel.emit();
  }

}
