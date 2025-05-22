import { Component } from '@angular/core';
import { ParticipanteService } from '../participante/participante.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  participantesCount: number = 0;
  lastUpdate: string = '';

  constructor(private participanteService: ParticipanteService) {}

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
