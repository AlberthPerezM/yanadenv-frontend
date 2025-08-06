import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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

  showOtroSintoma2 = false;
  showOtroSintoma3 = false;
  showOtroSintoma4 = false;

  constructor(
    private readonly datoclinicoService: DatoClinicoService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(this.procesarParametros);
  }

  private procesarParametros = (params: Params): void => {
    this.idParticipante = params['idPar'] ? +params['idPar'] : null;

    if (params['idDat']) {
      this.titulo = 'Editar dato clínico';
      this.cargarDatoClinico(+params['idDat']);
    } else if (this.idParticipante) {
      // Buscar si el participante ya tiene un dato clínico
      this.datoclinicoService.getByParticipanteId(this.idParticipante).subscribe({
        next: dato => {
          this.datoclinico = dato;
          this.titulo = 'Editar dato clínico';
          this.showOtroSintoma2 = !!dato.otrosSintomas2;
          this.showOtroSintoma3 = !!dato.otrosSintomas3;
          this.showOtroSintoma4 = !!dato.otrosSintomas4;
        },
        error: err => {
          if (err.status === 404) {
            this.titulo = 'Registrar dato clínico';
            this.datoclinico = new DatoClinico();
          } else {
            this.mostrarAlerta('Error', 'No se pudo cargar el dato clínico', 'error');
          }
        }
      });
    }
  }

  guardar(): void {
    if (!this.validarFormulario()) return;

    const request$ = this.datoclinico.idDat
      ? this.datoclinicoService.update(this.datoclinico)
      : this.datoclinicoService.create(this.idParticipante!, this.datoclinico);

    request$.subscribe({
      next: () => this.finalizarAccion(
        this.datoclinico.idDat ? 'Dato clínico actualizado con éxito' : 'Dato clínico registrado con éxito'
      ),
      error: () => this.mostrarAlerta(
        'Error',
        this.datoclinico.idDat
          ? 'No se pudo actualizar el dato clínico'
          : 'No se pudo registrar el dato clínico',
        'error'
      )
    });
  }

  private cargarDatoClinico(idDat: number): void {
    this.datoclinicoService.getDatoClinico(idDat).subscribe({
      next: (dato) => {
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
      return this.alertarValidacion('La fecha de inicio de síntomas es requerida');
    }
    if (this.datoclinico.compromisoOrganos && !this.datoclinico.tipoCompromisoOrganos) {
      return this.alertarValidacion('Debe especificar el tipo de compromiso de órganos');
    }
    if (this.datoclinico.sangradoGrave && !this.datoclinico.tipoSangrado) {
      return this.alertarValidacion('Debe especificar el tipo de sangrado');
    }
    return true;
  }

  private alertarValidacion(mensaje: string): boolean {
    this.mostrarAlerta('Validación', mensaje, 'warning');
    return false;
  }

  private finalizarAccion(mensaje: string): void {
    this.mostrarAlerta('Éxito', mensaje, 'success');
    this.router.navigate(['/datoclinicos']);
  }

  private mostrarAlerta(
    titulo: string,
    mensaje: string,
    tipo: 'success' | 'error' | 'warning'
  ): void {
    Swal.fire(titulo, mensaje, tipo);
  }

  // Métodos para campos condicionales
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

  // Lógica para agregar campos dinámicos "otros síntomas"
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
