import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ParticipanteService } from '../../../components/participante/participante.service';
import { SharingDataService } from '../../../core/service/sharing-data.service';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent  {
  participantesCount: number = 0;
  lastUpdate: string = '';

  constructor(private participanteService: ParticipanteService ,
    private router: Router,
    private sharingData: SharingDataService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadParticipantesCount();

  }
   
  loadParticipantesCount(): void {
    this.participanteService.countParticipantes().subscribe(count => {
      this.participantesCount = count;
      this.lastUpdate = new Date().toLocaleString();
    });
  }

  
  
}
