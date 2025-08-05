import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ExamenLaboratorioService } from '../../core/service/examen-laboratorio.service';
import { ParticipanteService } from '../../core/service/participante.service';
import { ExamenLaboratorio } from '../../core/models/examen-laboratorio';
import { Participante } from '../../core/models/participante';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-examen-laboratorio',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './form-examen-laboratorio.component.html',
  styleUrl: './form-examen-laboratorio.component.css',
})
export class FormExamenLaboratorioComponent implements OnInit {
  public titulo: string = 'Asignar examen de Laboratorio';
  public participante: Participante = new Participante();
  public examen: ExamenLaboratorio = new ExamenLaboratorio();
  public examenes: ExamenLaboratorio[] = [];

  public examenesDisponibles: string[] = [
    'ELISA NS1-Dengue',
    'Aislamiento viral',
    'qRT-PCR Suero',
    'qRT-PCR Orina',
  ];

  constructor(
    private participanteService: ParticipanteService,
    private examenService: ExamenLaboratorioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarParticipante();
    this.cargarExamenSiExiste();
  }

  /** Cargar participante desde la ruta */
  private cargarParticipante(): void {
    const idPar = +this.activatedRoute.snapshot.params['idPar'];
    if (!idPar) {
      Swal.fire('Error', 'ID del participante no definido.', 'error');
      return;
    }

    this.participanteService.getParticipante(idPar).subscribe({
      next: (p) => {
        this.participante = p;
        this.examenes = p.examenesLaboratorio || [];
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el participante.', 'error');
      }
    });
  }

  /** Cargar examen si se está editando */
  private cargarExamenSiExiste(): void {
    const idExa = +this.activatedRoute.snapshot.params['idExa'];
    if (idExa) {
      this.examenService.getExamen(idExa).subscribe({
        next: (exa) => this.examen = { ...exa },
        error: () => Swal.fire('Error', 'No se pudo cargar el examen.', 'error')
      });
    }
  }

  /** Agregar un nuevo examen vacío */
  agregarExamen(): void {
    this.examenes.push(new ExamenLaboratorio());
  }

  /** Eliminar examen (local o backend si tiene ID) */
  eliminarExamen(index: number): void {
    const examen = this.examenes[index];
    if (examen.idExa) {
      this.examenService.deleteExamenFromParticipante(this.participante.idPar!, examen.idExa).subscribe({
        next: () => {
          this.examenes.splice(index, 1);
          Swal.fire('Eliminado', 'Examen eliminado correctamente', 'success');
        },
        error: () => {
          Swal.fire('Error', 'No se pudo eliminar el examen', 'error');
        }
      });
    } else {
      this.examenes.splice(index, 1);
    }
  }

  /** Guardar todos los exámenes nuevos o actualizar existentes */
  guardarExamenes(): void {
    if (!this.participante?.idPar) {
      Swal.fire('Error', 'ID del participante no disponible.', 'error');
      return;
    }

    const exámenesCompletos = this.examenes.filter(ex =>
      ex.nombreExa?.trim() && ex.examenResultado && ex.fechaResultado
    );

    if (exámenesCompletos.length === 0) {
      Swal.fire('Advertencia', 'Debe agregar al menos un examen completo.', 'warning');
      return;
    }

    const nuevos = exámenesCompletos.filter(ex => !ex.idExa);
    const existentes = exámenesCompletos.filter(ex => ex.idExa);

    if (nuevos.length > 0) {
      this.examenService.saveExamenes(nuevos, this.participante.idPar!).subscribe({
        next: () => this.actualizarExamenesExistentes(existentes),
        error: () => Swal.fire('Error', 'No se pudieron guardar los exámenes nuevos.', 'error')
      });
    } else {
      this.actualizarExamenesExistentes(existentes);
    }
  }

  /** Actualiza exámenes ya existentes */
  private actualizarExamenesExistentes(examenes: ExamenLaboratorio[]): void {
    if (examenes.length === 0) {
      Swal.fire('Éxito', 'Exámenes guardados correctamente.', 'success');
      return;
    }

    let completados = 0;
    let errores = 0;

    for (const ex of examenes) {
      this.examenService.update(ex).subscribe({
        next: () => completados++,
        error: () => errores++,
        complete: () => {
          if (completados + errores === examenes.length) {
            if (errores === 0) {
              Swal.fire('Éxito', 'Todos los exámenes fueron actualizados.', 'success');
            } else {
              Swal.fire('Advertencia', `Se actualizaron con errores (${errores})`, 'warning');
            }
          }
        }
      });
    }
  }

  /** Actualizar examen individual (formulario de edición) */
  update(): void {
    this.examenService.update(this.examen).subscribe({
      next: (res) => {
        Swal.fire('Examen Actualizado', `Examen actualizado correctamente.`, 'success');
        this.router.navigate(['/examenes-laboratorio']);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el examen.', 'error');
      }
    });
  }
}
