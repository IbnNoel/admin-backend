import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsComponent),
      multi: true
    }
  ]
})
export class ChipsComponent implements OnInit, ControlValueAccessor {

  constructor() {
  }

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() stringInput;

  addOnBlur = false;
  input: any;
  inputCtrl = new FormControl();
  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  writeValue(input: string) {
    this.input = input;
  }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const copiedInput = this.input;
    if (value) {
      if (this.stringInput) {
        copiedInput.push(value);
      } else {
        copiedInput.push(+value);
      }
    }
    if (input) {
      input.value = '';
    }
    this.inputCtrl.setValue(null);
    console.log(this.input);
  }

  remove(data: any): void {
    const copiedInput = this.input;

    const index = copiedInput.indexOf(data);

    if (index >= 0) {
      copiedInput.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<number[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.input = [...this.input];
  }

}
