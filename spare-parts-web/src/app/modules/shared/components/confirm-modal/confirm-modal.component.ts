import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Output() proceedAction = new EventEmitter();
  message: string;
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  ok(): void {
    this.proceedAction.emit(true);
    this.bsModalRef.hide();
  }
  cancel(): void {
    this.proceedAction.emit(false);
    this.bsModalRef.hide();
  }
}
