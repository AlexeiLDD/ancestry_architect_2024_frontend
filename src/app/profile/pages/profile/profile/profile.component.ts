import { Component} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../../services/profile/profile.service';
import { UserService } from '../../../../core/services/user/user.service';
import { User } from '../../../../core/models/user';
import { PendingSubmitAnimationBase } from '../../../../auth/shared/pending-submit-animation-base';
import { DateModule } from '../../../../shared/modules/date';
import { UpdateProfileResponse, Response, SeveralErrorsResponse } from '../../../../core/models/response';
import { PopupMessageComponent } from '../../../../shared/components/popup-message/popup-message.component';


const SubmitButtonTitle = 'Обновить профиль';
const SucceedMessage = 'Профиль успешно обновлён.';
const UnknownError = 'Что-то пошло не так. Попробуйте позже.'
const MessageTimeout = 4000; //ms

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage, PopupMessageComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends PendingSubmitAnimationBase {
  override submitButtonTitle = SubmitButtonTitle;

  message = '';
  isSucceed = false;
  renderMessage = false;

  profileForm = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    surname: new FormControl(''),
    birthdate: new FormControl(''),
    gender: new FormControl(''),
    avatarPath: new FormControl(''),
  });

  private profileFormData = new FormData();

  constructor(
    private profileService: ProfileService, 
    private userService: UserService,
  ) {
    super();

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
  } 

  loadAvatar(event: Event) {
    let file = (event.target as HTMLInputElement).files?.[0];

    if (file === undefined) {
      return;
    }

    this.profileFormData.set("avatar", file);

    const avatarReader = new FileReader();
    avatarReader.onload = (event) => {
      this.profileForm.patchValue({ avatarPath: event.target?.result as string });
    }

    avatarReader.readAsDataURL(file);
  }

  updateProfile() {
    const birthdate = DateModule.formatDate(this.profileForm.controls.birthdate.value as string);

    this.profileFormData.set("email", this.profileForm.controls.email.value as string);
    this.profileFormData.set("name", this.profileForm.controls.name.value as string);
    this.profileFormData.set("surname", this.profileForm.controls.surname.value as string);
    this.profileFormData.set("gender", this.profileForm.controls.gender.value as string);
    this.profileFormData.set("birthdate", birthdate);

    this.message = '';
    const animationTimeout = this.startLoadingAnimation();

    this.profileService.updateProfile(this.profileFormData).subscribe({
      next: (value) => {
        if (value.code === HttpStatusCode.Ok) {
          if (this.userService.User !== undefined) {
            const body = (value as Response<UpdateProfileResponse>).body;

            this.userService.User.email = body.user.email;
            this.userService.User.name = body.profile.name;
            this.userService.User.surname = body.profile.surname;
          }

          this.message = SucceedMessage;
          this.isSucceed = true;
        } else {
          this.message = UnknownError;
          this.isSucceed = false;
        }

        clearInterval(animationTimeout); 
        this.showMessage();

        this.submitButtonTitle = SubmitButtonTitle; 
        this.pending = false;
      },
      error: (err) => {
        if (err.status === HttpStatusCode.BadRequest) {
          try {
            this.message = (err.error as SeveralErrorsResponse).errors.join('. ');
          } catch (err) {
            this.message = UnknownError;
          }
          
          this.isSucceed = false;
        }

        if (this.message === '') {
          this.message = UnknownError;
        }

        clearInterval(animationTimeout); 
        this.showMessage();

        this.submitButtonTitle = SubmitButtonTitle; 
        this.pending = false;
      },
    });
  }

  private showMessage() {
    this.renderMessage = true;

    setTimeout(() => {
      this.renderMessage = false;
    }, MessageTimeout)
  }
}
