import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatoClinico } from '../../core/models/dato-clinico';
import { DatoClinicoService } from '../../core/service/dato-clinico.service';

@Component({
  selector: 'app-form-datoclinico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-dato-clinico.component.html'
})
export class FormDatoClinicoComponent implements OnInit {
  datoclinico: DatoClinico = new DatoClinico();
  titulo: string = 'Crear Dato Clínico';
  showOtroSintoma2: boolean = false;
  showOtroSintoma3: boolean = false;
  showOtroSintoma4: boolean = false;

  constructor(
    private datoclinicoService: DatoClinicoService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarDatoClinico();
  }

  cargarDatoClinico(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['idDat'];
      if (id) {
        this.titulo = 'Editar Dato Clínico';
        this.datoclinicoService.getDatoClinico(id).subscribe(
          datoclinico => {
            this.datoclinico = datoclinico;
            if (this.datoclinico.otrosSintomas2) this.showOtroSintoma2 = true;
            if (this.datoclinico.otrosSintomas3) this.showOtroSintoma3 = true;
            if (this.datoclinico.otrosSintomas4) this.showOtroSintoma4 = true;
          },
          error => {
            Swal.fire('Error', 'No se pudo cargar el dato clínico', 'error');
            this.router.navigate(['/datoclinicos']);
          }
        );
      }
    });
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

  create(): void {
    if (!this.validarFormulario()) return;
    
    this.datoclinicoService.create(this.datoclinico).subscribe(
      () => {
        Swal.fire('Éxito', 'Dato clínico creado con éxito', 'success');
        this.router.navigate(['/datoclinicos']);
      },
      error => {
        Swal.fire('Error', 'No se pudo crear el dato clínico', 'error');
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
}