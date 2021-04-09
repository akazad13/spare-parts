import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile } from 'src/app/shared/model/User/userProfile.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  userProfile: UserProfile;
  routeSubscription: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.data.subscribe((data) => {
      this.userProfile = data.userProfile[0];
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
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
