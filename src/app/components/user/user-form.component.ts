import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from './user';
import { ActivatedRoute } from '@angular/router';
import { SharingDataService } from '../../service/sharing-data.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  user: User;
  errors: any = {};

  constructor(
    private route: ActivatedRoute,
    private sharingData: SharingDataService,
    private service: UserService) {
    this.user = new User();
  }

  ngOnInit(): void {

    this.sharingData.errorsUserFormEventEmitter.subscribe(errors => this.errors = errors);
    this.sharingData.selectUserEventEmitter.subscribe(user => this.user = user);

    this.route.paramMap.subscribe(params => {
      const id: number = +(params.get('id') || '0');

      if (id > 0) {
        this.sharingData.findUserByIdEventEmitter.emit(id);
        // this.service.findById(id).subscribe(user => this.user = user);
      }
    });
  }

  onSubmit(userForm: NgForm): void {

      this.sharingData.newUserEventEmitter.emit(this.user);
      console.log(this.user);
  }

  onClear(userForm: NgForm): void {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }

}