import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExamenLaboratorioService } from '../../core/service/examen-laboratorio.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExamenLaboratorio } from '../../core/models/examen-laboratorio';
import Swal from 'sweetalert2';
import { ParticipanteService } from '../../core/service/participante.service';
import { Participante } from '../../core/models/participante';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-examen-laboratorio',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './form-examen-laboratorio.component.html',
  styleUrl: './form-examen-laboratorio.component.css',
})
export class FormExamenLaboratorioComponent {
  public examen: ExamenLaboratorio = new ExamenLaboratorio();
  public examenes: ExamenLaboratorio[] = [];
  public titulo: string = 'Asignar examen de Laboratorio';
  public idPar!: number;
  public participante: any = {};

  // Lista de exámenes predefinidos
  examenesDisponibles: string[] = [
    'ELISA NS1-Dengue',
    'Aislamiento viral',
    'qRT-PCR Suero',
    'qRT-PCR Orina',
  ];

  constructor(
    private participanteService: ParticipanteService,
    private examenService: ExamenLaboratorioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient // Agregar esta línea
  ) { }

  ngOnInit(): void {
    this.cargarExamen();
    this.cargarParticipante();
  }

  // Agregar un nuevo examen a la lista
  agregarExamen(): void {
    this.examenes.push(new ExamenLaboratorio());
  }
  // Cargar examen por ID
  public cargarExamen(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['idExa'];
      if (id) {
        this.examenService.getExamen(id).subscribe((examen) => {
          this.examen = { ...examen };
          console.log('Examen cargado:', this.examen);
        });
      }
    });
  }
  // Cargar participante
  private cargarParticipante(): void {
    this.activatedRoute.params.subscribe((params) => {
      const idPar = +params['idPar'];
      if (idPar) {
        this.participanteService
          .getParticipante(idPar)
          .subscribe((participante) => {
            this.participante = participante;
            this.idPar = idPar;
            this.examenes = participante.examenesLaboratorio || [];
            console.log('Participante cargado:', this.participante);
          });
      } else {
        console.error('El parámetro idPar no está presente en la ruta.');
      }
    });
  }
  // Actualizar examen
  public update(): void {
    console.log('Examen antes de actualizar:', this.examen);
    this.examenService.update(this.examen).subscribe((json) => {
      this.router.navigate(['/examenes-laboratorio']);
      Swal.fire('Examen Actualizado', `Examen actualizado: ${json.examen.nombreExa}`, 'success'
      );
    });
  }

  // Eliminar un examen de la lista
  eliminarExamen(index: number): void {
    const examen = this.examenes[index];
    if (examen.idExa) {
      this.examenService
        .deleteExamenFromParticipante(this.participante.idPar, examen.idExa)
        .subscribe({
          next: () => {
            this.examenes.splice(index, 1);
            Swal.fire('Eliminado', 'Examen eliminado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el examen:', error);
            Swal.fire('Error', 'No se pudo eliminar el examen', 'error');
          },
        });
    } else {
      this.examenes.splice(index, 1);
    }
  }

  /*Asociación de examen a participante*/
  guardarExamenes(): void {
    if (!this.participante || !this.participante.idPar) {
      Swal.fire('Error', 'El ID del participante no está definido.', 'error');
      return;
    }
    const examenesValidos = this.examenes.filter(
      (ex) => ex.nombreExa?.trim() && ex.examenResultado && ex.fechaResultado
    );
    if (examenesValidos.length === 0) {
      Swal.fire('Advertencia', 'Debe agregar al menos un examen completo.', 'warning');
      return;
    }
    const nuevos = examenesValidos.filter((ex) => !ex.idExa);
    const existentes = examenesValidos.filter((ex) => ex.idExa);
    if (nuevos.length > 0) {
      this.examenService.saveExamenes(nuevos, this.participante.idPar).subscribe({
        next: () => {
          this.actualizarExamenesExistentes(existentes);
        },
        error: () => {
          Swal.fire('Error', 'No se pudieron guardar los exámenes nuevos.', 'error');
        },
      });
    } else {
      this.actualizarExamenesExistentes(existentes);
    }
  }

  private actualizarExamenesExistentes(examenes: ExamenLaboratorio[]): void {
    if (examenes.length === 0) {
      Swal.fire('Éxito', 'Exámenes guardados correctamente.', 'success');
      //this.router.navigate(['/participantes']);
      return;
    }
    let errores = 0;
    let completados = 0;
    examenes.forEach((examen, index) => {
      this.examenService.update(examen).subscribe({
        error: () => errores++,
        complete: () => {
          completados++;
          if (completados === examenes.length) {
            if (errores === 0) {
              Swal.fire('Éxito', 'Todos los exámenes fueron actualizados.', 'success');
            } else {
              Swal.fire('Advertencia', `Se actualizaron con errores (${errores})`, 'warning'
              );
            }
            //this.router.navigate(['/participantes']);
          }
        },
      });
    });
  }


}
