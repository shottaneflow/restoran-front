import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile-service/profile.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  phone: string = '';
  clientName: string = '';

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.phone = data.phone;
        this.clientName = data.clientName;
      },
      error: (error) => {
        console.error('Error loading profile', error);
      }
    });
  }

  updateProfile() {
    const userData = { phone: this.phone, clientName: this.clientName };

    this.profileService.updateProfile(userData).subscribe({
      next: (response) => {
        console.log('Profile updated successfully', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error updating profile', error);
      }
    });
  }
  goToHome() {
    this.router.navigate(['/']);
  }
}
