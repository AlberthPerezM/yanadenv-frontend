import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Centro } from './centro';
import { CentroService } from './centro.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-centros',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './centros.component.html',
})
export class CentrosComponent implements OnInit {
  centros: Centro[] = [];

  constructor(private centroService: CentroService) {}

  ngOnInit() {
    this.centroService.getCentros().subscribe(
      centros => this.centros = centros
    );
  }

  // Método para eliminar un centro con confirmación de SweetAlert
  delete(centro: Centro): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "¿Está seguro?",
      text: `¿Seguro que desea eliminar el centro ${centro.nombreCen}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.centroService.delete(centro.idCen!).subscribe(() => {
          this.centros = this.centros.filter(cen => cen !== centro);
          Swal.fire(
            'Centro Eliminado!',
            `Centro ${centro.nombreCen} eliminado con éxito.`,
            'success'
          );
        });
      }
    });
  }
}
