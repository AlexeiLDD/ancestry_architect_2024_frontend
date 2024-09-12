import { Component } from '@angular/core';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserService } from '../../../../core/services/user/user.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpStatusCode } from '@angular/common/http';
import { User } from '../../../../core/models/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileForm = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    surname: new FormControl(''),
    birthdate: new FormControl(''),
    gender: new FormControl(''),
    avatarPath: new FormControl(''),
  });

  constructor(
    private profileService: ProfileService, 
    private userService: UserService,
  ) {
    userService.observableUser$.subscribe(() => {
      if (userService.User === undefined) {
        throw new Error('user is undefined');
      }
  
      profileService.getProfile(userService.User?.id).subscribe((value) => {
        if (value.code === HttpStatusCode.Ok){
          const { email } = userService.User as User;
          const { name, surname, birthdate, gender, avatarPath } = value.body;
  
          this.profileForm.patchValue({
            email,
            name,
            surname,
            birthdate,
            gender,
            avatarPath,
          });
        }
      });
    });
  }
    
}
