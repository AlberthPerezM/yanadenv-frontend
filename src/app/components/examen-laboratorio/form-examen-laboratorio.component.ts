import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExamenLaboratorioService } from './examen-laboratorio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamenLaboratorio } from './examen-laboratorio';
import Swal from 'sweetalert2';
import { ParticipanteService } from '../participante/participante.service';
import { Participante } from '../participante/participante';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-examen-laboratorio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-examen-laboratorio.component.html'
})
export class FormExamenLaboratorioComponent {
  public examen: ExamenLaboratorio = new ExamenLaboratorio();
  public examenes: ExamenLaboratorio[] = []; // Lista de exámenes a asociar
  public titulo: string = 'Asignar Examen de Laboratorio';
  public idPar!: number; // ID del participante
  public participante: any = {}; // Declarar la propiedad participante



  // Lista de exámenes predefinidos
  examenesDisponibles: string[] = [
    'ELISA NS1-Dengue',
    'Aislamiento viral',
    'qRT-PCR Suero',
    'qRT-PCR Orina'
  ];
  urlEndPoint: any;

  constructor(
    private participanteService: ParticipanteService,
    private examenService: ExamenLaboratorioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient // Agregar esta línea

  ) {}

  ngOnInit(): void {
    this.cargarExamen();
    this.cargarParticipante();
  }

   // Cargar participante por ID
   private cargarParticipante(): void {
    this.activatedRoute.params.subscribe((params) => {
      const idPar = +params['idPar']; // Capturar el idPar desde la ruta
      if (idPar) {
        this.participanteService.getParticipante(idPar).subscribe((participante) => {
          this.participante = participante;
          this.idPar = idPar; // Asignar el idPar al componente
          this.examenes = participante.examenesLaboratorio || []; // Cargar exámenes existentes
          console.log('Participante cargado:', this.participante);
        });
      } else {
        console.error('El parámetro idPar no está presente en la ruta.');
      }
    });
  }

  guardarExamenes(): void {
    if (!this.participante || !this.participante.idPar) {
      Swal.fire('Error', 'El ID del participante no está definido. Por favor, regrese e intente nuevamente.', 'error');
      return;
    }
  
    // Filtrar exámenes que tienen nombre (para evitar enviar vacíos)
    const examenesValidos = this.examenes.filter(ex => ex.nombreExa && ex.nombreExa.trim() !== '');
  
    if (examenesValidos.length === 0) {
      Swal.fire('Advertencia', 'Debe agregar al menos un examen válido', 'warning');
      return;
    }
  
    this.examenService.saveExamenes(examenesValidos, this.participante.idPar).subscribe(
      (response) => {
        Swal.fire('Éxito', 'Exámenes guardados correctamente', 'success');
        this.router.navigate(['/participantes']); // O redirige a donde sea apropiado
      },
      (error) => {
        console.error('Error al guardar exámenes:', error);
        Swal.fire('Error', 'No se pudieron guardar los exámenes', 'error');
      }
    );
  }
  // Agregar un nuevo examen a la lista
  agregarExamen(): void {
    this.examenes.push(new ExamenLaboratorio());
  }

  // Eliminar un examen de la lista
  eliminarExamen(index: number): void {
    this.examenes.splice(index, 1);
  }

        asignarExamenes(participanteId: number, examenes: ExamenLaboratorio[]): Observable<Participante> {
          return this.http.post<Participante>(
            `${this.urlEndPoint}/${participanteId}/examenes`,
            examenes
          );
        }
        

create(): void {
  this.examenService.create(this.examen, this.idPar).subscribe(
    (json) => {
      this.router.navigate(['/examenes-laboratorio']);
      Swal.fire('Nuevo Examen', `Examen creado para el participante con ID ${this.idPar}`, 'success');
    },
    (error) => {
      console.error('Error al crear el examen:', error);
      Swal.fire('Error', 'No se pudo crear el examen.', 'error');
    }
  );
}
  // Cargar examen por ID
  public cargarExamen(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['idExa'];
      if (id) {
        this.examenService.getExamen(id).subscribe((examen) => {
          this.examen = { ...examen }; // Clonamos para evitar problemas de referencia
          console.log('Examen cargado:', this.examen);
        });
      }
    });
  }

  // Actualizar examen
  public update(): void {
    console.log('Examen antes de actualizar:', this.examen);
    this.examenService.update(this.examen).subscribe((json) => {
      this.router.navigate(['/examenes-laboratorio']);
      Swal.fire('Examen Actualizado', `Examen actualizado: ${json.examen.nombreExa}`, 'success');
    });
  }
  
}
