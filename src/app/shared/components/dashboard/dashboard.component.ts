import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ParticipanteService } from '../../../components/participante/participante.service';
import { DatoClinicoService } from '../../../components/dato-clinico/dato-clinico.service'; // Asegúrate de tener esta ruta correcta
import { SharingDataService } from '../../../core/service/sharing-data.service';
import { AuthService } from '../../../core/service/auth.service';
import { CentroService } from '../../../core/service/centro.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  participantesCount: number = 0;
  datosClinicosCount: number = 0; // Nuevo contador
  lastUpdate: string = '';
  centrosCount: number = 0;

  constructor(
    private centroService: CentroService,
    private participanteService: ParticipanteService,
    private datoClinicoService: DatoClinicoService, // Inyectar servicio
    private router: Router,
    private sharingData: SharingDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadParticipantesCount();
    this.loadCentrosCount();
    this.loadDatosClinicosCount(); 
  }

  // Primer contador: Participantes
  loadParticipantesCount(): void {
    this.participanteService.countParticipantes().subscribe({
      next: (count) => {
        this.participantesCount = count;
        this.lastUpdate = new Date().toLocaleString();
      },
      error: (err) => console.error('Error al contar participantes:', err),
    });
  }

  // Contar centros
  loadCentrosCount(): void {
    this.centroService.countCentros().subscribe({
      next: (count) => {
        this.centrosCount = count;
        this.lastUpdate = new Date().toLocaleString();
      },
      error: (err) => console.error('Error al contar centros:', err),
    });
  }

  //Contador de datos clínicos
  // Contar datos clínicos
loadDatosClinicosCount(): void {
  this.datoClinicoService.countDatosClinicos().subscribe({
    next: (count) => {
      this.datosClinicosCount = count;
      this.lastUpdate = new Date().toLocaleString();
    },
    error: (err) => console.error('Error al contar datos clínicos:', err),
  });
}

}
