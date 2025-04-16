import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExamenLaboratorioService } from './examen-laboratorio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamenLaboratorio } from './examen-laboratorio';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-examen-laboratorio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-examen-laboratorio.component.html'
})
export class FormExamenLaboratorioComponent {
  public examen: ExamenLaboratorio = new ExamenLaboratorio();
  public titulo: string = 'Crear Examen de Laboratorio';

  // Lista de exámenes predefinidos
  examenesDisponibles: string[] = [
    'ELISA NS1-Dengue',
    'Aislamiento viral',
    'qRT-PCR Suero',
    'qRT-PCR Orina'
  ];

  constructor(
    private examenService: ExamenLaboratorioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarExamen();
  }

  // Crear examen de laboratorio
  create(): void {
    this.examenService.create(this.examen).subscribe((json) => {
      this.router.navigate(['/examenes-laboratorio']);
      Swal.fire('Nuevo Examen', `Examen creado: ${json.examen.nombreExa}`, 'success');
    });
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
