import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { User } from '../user/user';
import { login } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'] 
})
export class AuthComponent {

  user: User;

  constructor(private store: Store<{auth: any}>
  ) {
    this.user = new User();
  }

  onSubmit() {
    if (!this.user.username || !this.user.password) {
      Swal.fire(
        'Error de validacion',
        'Username y password requeridos!',
        'error'
      );
    } else {
      this.store.dispatch(login({ username: this.user.username, password: this.user.password }));
    }
  }
}
