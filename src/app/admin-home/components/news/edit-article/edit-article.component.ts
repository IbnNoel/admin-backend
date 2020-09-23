import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {

  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  editFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.editFormGroup = this.formBuilder.group({
      _id: [''],
      articleSnippet: ['', Validators.required],
      articleHeadline: ['', Validators.required]
     });
   }

  ngOnInit(): void {
  }

  updateArticleHeadLine() {
    this.update.emit();
  }

  cancelButton() {
    this.cancel.emit();
  }
}
