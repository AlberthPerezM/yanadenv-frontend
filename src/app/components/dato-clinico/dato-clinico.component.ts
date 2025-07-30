
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { DatoClinico } from '../../core/models/dato-clinico';
import { DatoClinicoService } from '../../core/service/dato-clinico.service';

@Component({
  selector: 'app-datoclinico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dato-clinico.component.html'
})
export class DatoClinicoComponent implements OnInit {
  datoclinicos: DatoClinico[] = [];

  constructor(private datoclinicoService: DatoClinicoService) {}

  ngOnInit() {
    this.datoclinicoService.getDatosClinicos().subscribe(
      datoclinicos => this.datoclinicos = datoclinicos
    );
  }

  delete(datoclinico: DatoClinico): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar el dato clínico con ID ${datoclinico.idDat}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.datoclinicoService.delete(datoclinico.idDat!).subscribe(() => {
          this.datoclinicos = this.datoclinicos.filter(dc => dc !== datoclinico);
          Swal.fire(
            'Eliminado!',
            'El dato clínico ha sido eliminado.',
            'success'
          );
        });
      }
    });
  }
}