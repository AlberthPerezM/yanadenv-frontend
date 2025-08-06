import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Campania } from '../../core/models/campania';
import { CampaniaService } from '../../core/service/campania.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-campania',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './campania.component.html',
  styleUrl: './campania.component.css'
})
export class CampaniaComponent implements OnInit {

  campanias: Campania[] = [];
  titulo: string = 'Lista de Campañas';

  constructor(
    private campaniaService: CampaniaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCampanias();
  }

  cargarCampanias(): void {
    this.campaniaService.getAll().subscribe(campanias => {
      this.campanias = campanias;
    });
  }

  delete(campania: Campania): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la campaña "${campania.nombreCam}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.campaniaService.delete(campania.idCam!).subscribe(() => {
          this.campanias = this.campanias.filter(c => c.idCam !== campania.idCam);
          Swal.fire('Eliminado', 'La campaña ha sido eliminada correctamente', 'success');
        });
      }
    });
  }
}