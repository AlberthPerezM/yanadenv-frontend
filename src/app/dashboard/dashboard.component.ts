import { Component, OnInit } from '@angular/core';
import { ParticipanteService } from '../components/participante/participante.service';
import { SharingDataService } from '../service/sharing-data.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';

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
