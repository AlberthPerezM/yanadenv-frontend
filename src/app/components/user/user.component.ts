import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from './user';

import { PaginatorComponent } from '../../paginator/paginator.component';
import { UserService } from '../../service/user.service';
import { SharingDataService } from '../../service/sharing-data.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule,PaginatorComponent],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  title: string = 'Listado de usuarios!';

  users: User[] = [];
  paginator: any = {};

  constructor(
    private service: UserService,
    private sharingData: SharingDataService,
    private authService: AuthService,
    private router: Router,
  private route: ActivatedRoute) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
      this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];
    }
  }

  ngOnInit(): void {
    if (this.users == undefined || this.users == null || this.users.length == 0) {
      console.log('consulta findAll')
      // this.service.findAll().subscribe(users => this.users = users);
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page') || '0');
        console.log(page)
        this.service.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[];
          this.paginator = pageable;
          this.sharingData.pageUsersEventEmitter.emit({users: this.users, paginator: this.paginator});
        });
      })
    }
  }

  onRemoveUser(id: number): void {
    this.sharingData.idUserEventEmitter.emit(id);
  }

  onSelectedUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  get admin() {
    return this.authService.isAdmin();
  }
}
