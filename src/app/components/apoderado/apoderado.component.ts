import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApoderadoService } from '../../core/service/apoderado.service';
import { RouterLink, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Apoderado } from '../../core/models/apoderado';

@Component({
  selector: 'app-apoderado',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './apoderado.component.html',
  styleUrl: './apoderado.component.css'
})
export class ApoderadosComponent implements OnInit {
  apoderados: Apoderado[] = [];

  constructor(private apoderadoService: ApoderadoService) { }

  ngOnInit() {
    this.apoderadoService.getApoderados().subscribe(
      apoderados => this.apoderados = apoderados
    );
  }

  // Método para eliminar un apoderado con confirmación de SweetAlert
  delete(apoderado: Apoderado): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "¿Está seguro?",
      text: `¿Seguro que desea eliminar al apoderado ${apoderado.nombre} ${apoderado.apellidoPaterno}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.apoderadoService.delete(apoderado.idApo!).subscribe(() => {
          this.apoderados = this.apoderados.filter(a => a !== apoderado);
          Swal.fire(
            'Apoderado Eliminado!',
            `Apoderado ${apoderado.nombre} ${apoderado.apellidoPaterno} eliminado con éxito.`,
            'success'
          );
        });
      }
    });
  }
}
