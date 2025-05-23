import { Component, OnInit } from '@angular/core';
import { ParticipanteService } from './participante.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Participante } from './participante';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApoderadoService } from '../apoderado/apoderado.service';

@Component({
  selector: 'app-form-participante',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './formParticipante.component.html',
  styleUrl: './formParticipante.component.css'
})
export class FormParticipanteComponent implements OnInit {
  public participante: Participante = new Participante();
  public titulo: string = 'Crear Participante';
  apoderadoExistenteId: number | null = null; // Guardará el ID del apoderado si existe
  idparticipante: number | null = null;

  constructor(
    private participanteService: ParticipanteService,
    private apoderadoService: ApoderadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarParticipante();

    this.activatedRoute.params.subscribe((params) => {
      this.participante.idPar = +params['idPar'];

      // Cargar todos los apoderados y buscar si este participante tiene uno
      this.apoderadoService.getApoderados().subscribe((apoderados) => {
        const apoderado = apoderados.find(
          (a) => a.participante && a.participante.idPar === this.participante.idPar
        );

        // Si existe un apoderado, guardamos su ID
        if (apoderado) {
          this.apoderadoExistenteId = apoderado.idApo;
        }
      });
    });
  }

  create(): void {
    this.participanteService.create(this.participante).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);

        if (response && response.idPar) {
          Swal.fire('Nuevo Participante', `Participante creado: ${response.nombre}`, 'success');

          // Redirige a la página de detalle del participante o a la lista
          this.router.navigate(['/participantes/detalle', response.idPar]);
        } else {
          console.error('No se pudo obtener el ID del participante creado');
          Swal.fire('Error', 'No se pudo obtener el ID del participante creado', 'error');
          this.router.navigate(['/participantes']);
        }
      },
      (error) => {
        console.error('Error al crear el participante:', error);
        Swal.fire('Error', 'Error al crear el participante', 'error');
      }
    );
  }

  // Cargar participante por ID
  public cargarParticipante(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['idPar'];
      if (id) {
        this.participanteService.getParticipante(id).subscribe((participante) => {
          this.participante = participante;
        });
      }
    });
  }

  // Actualizar participante
  public update(): void {
    this.participanteService.update(this.participante).subscribe((json) => {
      this.router.navigate(['/participantes']);
      Swal.fire(
        'Participante Actualizado',
        `Participante actualizado: ${json.participante.nombre}`,
        'success'
      );
    });
  }

  public continueToExams(): void {
    // Solo requerir apoderado si el participante es menor de edad
    if (this.participante.edad < 18 && !this.apoderadoExistenteId) {
      Swal.fire(
        'Falta Apoderado',
        'Los participantes menores de edad requieren un apoderado asignado.',
        'warning'
      );
    } else {
      this.router.navigate(['examenes/form', this.participante.idPar]);
    }
  }
}