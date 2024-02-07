import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss']
})
export class EmailVerifyComponent implements OnInit {
  baseUrl = environment.apiUrl;
  email: string;
  verificationCode: string;
  varificationStatus = false;
  verificationError: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.email = params.email;
      this.verificationCode = params.verificationCode;
      this.verify_user(this.email, this.verificationCode);
    });
  }

  verify_user(email: string, verificationCode: string): void {
    this.http
      .post<any>(this.baseUrl + 'customer/verifyCustomer', {
        email,
        verificationCode
      })
      .subscribe(
        (response) => {
          this.varificationStatus = true;
        },
        (error) => {
          this.verificationError = error;
        }
      );
  }
}
