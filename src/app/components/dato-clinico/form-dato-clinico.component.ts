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

  datoclinico!: DatoClinico;
  titulo: string = 'Datos clínicos';
  showOtroSintoma2: boolean = false;
  showOtroSintoma3: boolean = false;
  showOtroSintoma4: boolean = false;
  idParticipante: number | null = null;

  constructor(
    private datoclinicoService: DatoClinicoService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.datoclinico = new DatoClinico();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const idDat = params['idDat'];
      const idPar = params['idPar'];

      if (idDat) {
        this.cargarDatoClinico(+idDat); // ✅ PASA el idDat aquí correctamente
      } else if (idPar) {
        this.titulo = 'Nuevo dato clínico';
        this.idParticipante = Number(idPar);
        console.log('Modo creación - ID del participante:', this.idParticipante);
      }
    });
  }

  create(): void {
    if (!this.validarFormulario()) return;

    if (!this.idParticipante) {
      Swal.fire('Error', 'No se recibió el ID del participante', 'error');
      return;
    }

    this.datoclinicoService.create(this.datoclinico, this.idParticipante).subscribe(
      () => {
        Swal.fire('Éxito', 'Dato clínico registrado con éxito', 'success');
        this.router.navigate(['/datoclinicos']);
      },
      error => {
        Swal.fire('Error', 'No se pudo registrar el dato clínico', 'error');
      }
    );
  }

  update(): void {
    if (!this.validarFormulario()) return;

    this.datoclinicoService.update(this.datoclinico).subscribe(
      () => {
        Swal.fire('Éxito', 'Dato clínico actualizado con éxito', 'success');
        this.router.navigate(['/datoclinicos']);
      },
      error => {
        Swal.fire('Error', 'No se pudo actualizar el dato clínico', 'error');
      }
    );
  }

  private validarFormulario(): boolean {
    if (!this.datoclinico.fechaInicioSintomas) {
      Swal.fire('Validación', 'La fecha de inicio de síntomas es requerida', 'warning');
      return false;
    }

    if (this.datoclinico.compromisoOrganos && !this.datoclinico.tipoCompromisoOrganos) {
      Swal.fire('Validación', 'Debe especificar el tipo de compromiso de órganos', 'warning');
      return false;
    }

    if (this.datoclinico.sangradoGrave && !this.datoclinico.tipoSangrado) {
      Swal.fire('Validación', 'Debe especificar el tipo de sangrado', 'warning');
      return false;
    }

    return true;
  }

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

  addOtroSintoma(): void {
    if (!this.showOtroSintoma2) {
      this.showOtroSintoma2 = true;
    } else if (!this.showOtroSintoma3) {
      this.showOtroSintoma3 = true;
    } else if (!this.showOtroSintoma4) {
      this.showOtroSintoma4 = true;
    }
  }

  cargarDatoClinico(idDat: number): void {
    this.titulo = 'Editar dato clínico';
    this.datoclinicoService.getDatoClinico(idDat).subscribe(
      datoclinico => {
        this.datoclinico = datoclinico;

        this.showOtroSintoma2 = !!this.datoclinico.otrosSintomas2;
        this.showOtroSintoma3 = !!this.datoclinico.otrosSintomas3;
        this.showOtroSintoma4 = !!this.datoclinico.otrosSintomas4;
      },
      error => {
        Swal.fire('Error', 'No se pudo cargar el dato clínico', 'error');
        this.router.navigate(['/datoclinicos']);
      }
    );
  }

}
