import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserProfile } from '../../../shared/model/User/userProfile.model';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  @Input() userProfile: UserProfile;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.userProfile.createdOn != null) {
      this.userProfile.createdOn = new Date(
        this.userProfile.createdOn.replace('T', ' ') + ' UTC'
      ).toLocaleString();
    }

    if (this.userProfile.modifiedOn != null) {
      this.userProfile.modifiedOn = new Date(
        this.userProfile.modifiedOn.replace('T', ' ') + ' UTC'
      ).toLocaleString();
    }
  }
}
