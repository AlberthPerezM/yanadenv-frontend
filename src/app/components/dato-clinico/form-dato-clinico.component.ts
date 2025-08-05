import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatoClinico } from '../../core/models/dato-clinico';
import { DatoClinicoService } from '../../core/service/dato-clinico.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-datoclinico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './form-dato-clinico.component.html'
})
export class FormDatoClinicoComponent implements OnInit {

  datoclinico: DatoClinico = new DatoClinico();
  titulo = 'Datos clínicos';
  idParticipante: number | null = null;

  // Mostrar campos condicionales para "otros síntomas"
  showOtroSintoma2 = false;
  showOtroSintoma3 = false;
  showOtroSintoma4 = false;

  constructor(
    private datoclinicoService: DatoClinicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ idPar, idDat }) => {
      this.idParticipante = idPar ? +idPar : null;

      if (idDat) {
        this.titulo = 'Editar dato clínico';
        this.cargarDatoClinico(+idDat);
      } else {
        this.titulo = 'Registrar dato clínico';
      }
    });
  }

  create(): void {
    if (!this.validarFormulario() || !this.idParticipante) {
      if (!this.idParticipante) {
        this.mostrarAlerta('Error', 'No se recibió el ID del participante', 'error');
      }
      return;
    }

    this.datoclinicoService.create(this.datoclinico, this.idParticipante).subscribe({
      next: () => this.finalizarAccion('Dato clínico registrado con éxito'),
      error: () => this.mostrarAlerta('Error', 'No se pudo registrar el dato clínico', 'error')
    });
  }

  update(): void {
    if (!this.validarFormulario()) return;

    this.datoclinicoService.update(this.datoclinico).subscribe({
      next: () => this.finalizarAccion('Dato clínico actualizado con éxito'),
      error: () => this.mostrarAlerta('Error', 'No se pudo actualizar el dato clínico', 'error')
    });
  }

  private cargarDatoClinico(idDat: number): void {
    this.datoclinicoService.getDatoClinico(idDat).subscribe({
      next: dato => {
        this.datoclinico = dato;
        this.showOtroSintoma2 = !!dato.otrosSintomas2;
        this.showOtroSintoma3 = !!dato.otrosSintomas3;
        this.showOtroSintoma4 = !!dato.otrosSintomas4;
      },
      error: () => {
        this.mostrarAlerta('Error', 'No se pudo cargar el dato clínico', 'error');
        this.router.navigate(['/datoclinicos']);
      }
    });
  }

  private validarFormulario(): boolean {
    if (!this.datoclinico.fechaInicioSintomas) {
      this.mostrarAlerta('Validación', 'La fecha de inicio de síntomas es requerida', 'warning');
      return false;
    }

    if (this.datoclinico.compromisoOrganos && !this.datoclinico.tipoCompromisoOrganos) {
      this.mostrarAlerta('Validación', 'Debe especificar el tipo de compromiso de órganos', 'warning');
      return false;
    }

    if (this.datoclinico.sangradoGrave && !this.datoclinico.tipoSangrado) {
      this.mostrarAlerta('Validación', 'Debe especificar el tipo de sangrado', 'warning');
      return false;
    }

    return true;
  }

  private finalizarAccion(mensaje: string): void {
    this.mostrarAlerta('Éxito', mensaje, 'success');
    this.router.navigate(['/datoclinicos']);
  }

  private mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'warning'): void {
    Swal.fire(titulo, mensaje, tipo);
  }

  // Métodos para manejar limpieza de campos condicionales
  onFiebreChange(): void {
    if (!this.datoclinico.fiebre) {
      this.datoclinico.temperatura = undefined;
    }
  }

  onCompromisoOrganosChange(): void {
    if (!this.datoclinico.compromisoOrganos) {
      this.datoclinico.tipoCompromisoOrganos = undefined;
    }
  }

  onSangradoGraveChange(): void {
    if (!this.datoclinico.sangradoGrave) {
      this.datoclinico.tipoSangrado = undefined;
    }
  }

  // Añadir campos adicionales para "otros síntomas"
  addOtroSintoma(): void {
    if (!this.showOtroSintoma2) {
      this.showOtroSintoma2 = true;
    } else if (!this.showOtroSintoma3) {
      this.showOtroSintoma3 = true;
    } else if (!this.showOtroSintoma4) {
      this.showOtroSintoma4 = true;
    }
  }
}
