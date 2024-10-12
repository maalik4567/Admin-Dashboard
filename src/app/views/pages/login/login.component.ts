import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { inject } from '@angular/core';
import { StdService } from '../../../std.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [NgIf,CommonModule,FormsModule, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isSubmitted: boolean = false;
  invalidCredentials: boolean = false;

  stdService = inject(StdService);
  //router = inject(ActivatedRoute);
  constructor(private router: Router) {}

  onSubmit() {
    this.isSubmitted = true;
    this.invalidCredentials = false; // Reset the invalid credentials message on new submission

    if (this.username && this.password) {
      this.stdService.signIn(this.username, this.password).subscribe(
        response => {
          console.log('Login successful:', response);
          localStorage.setItem("std",this.username);
          this.router.navigate(['/dashboard']); 
          // Handle successful login, such as storing token, navigating to dashboard, etc.
        },
        error => {
          console.error('Login failed:', error);
          this.invalidCredentials = true; // Show invalid credentials message if login fails
        }
      );
    } else {
      console.warn('Please provide both username and password.');
    }
  }
}
