import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { Participante } from '../../core/models/participante';
import { ParticipanteService } from '../../core/service/participante.service';
import { ApoderadoService } from '../../core/service/apoderado.service';

@Component({
  selector: 'app-form-participante',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './formParticipante.component.html',
  styleUrl: './formParticipante.component.css'
})
export class FormParticipanteComponent implements OnInit {

  public participante: Participante = new Participante();
  public titulo: string = 'Participante';

  public apoderadoExistenteId: number | null = null;

  constructor(
    private participanteService: ParticipanteService,
    private apoderadoService: ApoderadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarParticipanteSiExiste();
  }

  // Cargar datos del participante si viene con ID
  private cargarParticipanteSiExiste(): void {
    this.activatedRoute.params.subscribe(params => {
      const idPar = +params['idPar'];

      if (idPar) {
        this.participanteService.getParticipante(idPar).subscribe(participante => {
          this.participante = participante;

          // Buscar si existe un apoderado relacionado
          this.apoderadoService.getApoderados().subscribe(apoderados => {
            const apoderado = apoderados.find(
              (a) => a.participante?.idPar === this.participante.idPar
            );
            if (apoderado) {
              this.apoderadoExistenteId = apoderado.idApo;
            }
          });
        });
      }
    });
  }

  // Crear nuevo participante
  public create(): void {
    this.participanteService.create(this.participante).subscribe({
      next: (response) => {
        if (response?.idPar) {
          Swal.fire('Nuevo Participante', `Participante creado: ${response.nombre}`, 'success');
          this.router.navigate(['/datoclinicos/form', response.idPar]);
        } else {
          Swal.fire('Error', 'No se pudo obtener el ID del participante creado', 'error');
        }
      },
      error: (error) => {
        console.error('Error al crear el participante:', error);
        Swal.fire('Error', 'Error al crear el participante', 'error');
      }
    });
  }

  // Actualizar participante existente
  public update(): void {
    this.participanteService.update(this.participante).subscribe(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Participante actualizado',
        text: 'Los datos se guardaron correctamente.',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true
      });
    });
  }

  // Navegar a la sección de exámenes si es válido
  public continueToExams(): void {
    if (this.participante.edad < 18 && !this.apoderadoExistenteId) {
      Swal.fire(
        'Falta Apoderado',
        'Los participantes menores de edad requieren un apoderado asignado.',
        'warning'
      );
    } else {
      this.router.navigate(['/examenes/form', this.participante.idPar]);
    }
  }

}
