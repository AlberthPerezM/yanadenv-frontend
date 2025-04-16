
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participante } from './participante';
import { ParticipanteService } from './participante.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participante',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './participante.component.html',
  styleUrl: './participante.component.css'
})
export class ParticipantesComponent implements OnInit {
  participantes: Participante[] = [];

  constructor(private participanteService: ParticipanteService) {}

  ngOnInit() {
    this.participanteService.getParticipantes().subscribe(
      participantes => this.participantes = participantes
    );
  }

  // Método para eliminar un participante con confirmación de SweetAlert
  delete(participante: Participante): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "¿Está seguro?",
      text: `¿Seguro que desea eliminar al participante ${participante.nombre} ${participante.apellidoPaterno}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.participanteService.delete(participante.idPar!).subscribe(() => {
          this.participantes = this.participantes.filter(p => p !== participante);
          Swal.fire(
            'Participante Eliminado!',
            `Participante ${participante.nombre} ${participante.apellidoPaterno} eliminado con éxito.`,
            'success'
          );
        });
      }
    });
  }

    //Nombre completo
    getNombreCompleto(participante: any): string {
      return `${participante.nombre} ${participante.apellidoPaterno} ${participante.apellidoMaterno}`.trim();
    }
}
