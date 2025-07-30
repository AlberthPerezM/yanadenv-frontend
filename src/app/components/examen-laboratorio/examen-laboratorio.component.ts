import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamenLaboratorio } from '../../core/models/examen-laboratorio';
import { RouterLink, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ExamenLaboratorioService } from '../../core/service/examen-laboratorio.service';

@Component({
  selector: 'app-examenes-laboratorio',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './examen-laboratorio.component.html',
  styleUrl: './examen-laboratorio.component.css',
})
export class ExamenLaboratorioComponent implements OnInit {
  examenes: ExamenLaboratorio[] = [];

  constructor(private examenService: ExamenLaboratorioService) { }

  ngOnInit() {
    this.examenService
      .getExamenes()
      .subscribe((examenes) => (this.examenes = examenes));
  }

  // Método para eliminar un examen con confirmación de SweetAlert
  delete(examen: ExamenLaboratorio): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: '¿Está seguro?',
        text: `¿Seguro que desea eliminar el examen ${examen.nombreExa}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.examenService.delete(examen.idExa!).subscribe(() => {
            this.examenes = this.examenes.filter((exa) => exa !== examen);
            Swal.fire(
              'Examen Eliminado!',
              `Examen ${examen.nombreExa} eliminado con éxito.`,
              'success'
            );
          });
        }
      });
  }
}
