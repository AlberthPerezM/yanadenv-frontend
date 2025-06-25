import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../user/user';
import Swal from 'sweetalert2';
import { SharingDataService } from '../service/sharing-data.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  user: User;

  constructor(private sharingData: SharingDataService) {
    this.user = new User();
  }


  // En AuthComponent
onSubmit() {
  if (!this.user.username || !this.user.password) {
    Swal.fire('Error de validacion', 'Username y password requeridos!', 'error');
  } else {
    this.sharingData.handlerLoginEventEmitter.emit({ 
      username: this.user.username, 
      password: this.user.password 
    });
  }
}
}
