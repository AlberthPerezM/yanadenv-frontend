import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalizacionSelectorComponent } from '../../selector-localizacion/selector-localizacion.component';
import { CampaniaService } from '../../../core/service/campania.service';
import { Campania } from '../../../core/models/campania';
import { Centro } from '../../../core/models/centro';

@Component({
  selector: 'app-form-campania',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, LocalizacionSelectorComponent],
  templateUrl: './form-campania.component.html',
})
export class FormCampaniaComponent implements OnInit {

  @Input() centroInicial: number | null = null; // <-- IMPORTANTE

  @Output() centroSeleccionado = new EventEmitter<number>();
  public campania: Campania = new Campania();
  public titulo: string = 'Registrar Campaña';
  public centroIdSeleccionado: number | null = null;


  constructor(
    private campaniaService: CampaniaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log('🔍 ngOnInit ejecutado');
    this.cargarCampania();
  }

  cargarCampania(): void {
    console.log('📦 Esperando parámetro de ruta...');
    this.activatedRoute.params.subscribe(params => {
      const id = params['idCam'];
      console.log('📥 ID recibido de ruta:', id);

      if (id) {
        this.titulo = 'Editar Campaña';
        console.log('🛠 Solicitando campaña con ID:', id);

        this.campaniaService.getById(+id).subscribe(campania => {
          console.log('✅ Campaña recibida del backend:', campania);
          this.campania = campania;

          if (campania.centro) {
            console.log('🏥 Centro incluido en campaña:', campania.centro);
            this.centroIdSeleccionado = campania.centro.idCent;
            console.log('📌 centroIdSeleccionado asignado a:', this.centroIdSeleccionado);
          } else {
            console.warn('⚠️ La campaña no tiene centro asignado');
          }
        }, error => {
          console.error('❌ Error al obtener campaña:', error);
        });
      } else {
        console.log('🆕 No hay ID en ruta, es modo crear.');
      }
    });
  }

  onCentroSeleccionado(idCentro: number): void {
    console.log('✅ Centro seleccionado desde hijo:', idCentro);
    this.centroIdSeleccionado = idCentro;
  }

  onSubmit(): void {
    console.log('📤 Enviando formulario...');
    if (!this.centroIdSeleccionado) {
      Swal.fire('Error', 'Debe seleccionar un centro', 'error');
      return;
    }

    this.campania.centro = { idCent: Number(this.centroIdSeleccionado) } as Centro;
    console.log('📦 Campaña lista para enviar:', this.campania);

    if (!this.campania.idCam) {
      this.create();
    } else {
      this.update();
    }
  }

  create(): void {
    console.log('🆕 Creando nueva campaña...');
    this.campaniaService.create(this.campania).subscribe({
      next: () => {
        console.log('✅ Campaña creada exitosamente');
        Swal.fire('Creado', 'Campaña registrada correctamente', 'success');
        this.router.navigate(['/campanias']);
      },
      error: (err) => {
        console.error('❌ Error al crear campaña:', err);
        Swal.fire('Error', this.getErrorMessage(err), 'error');
      }
    });
  }

  update(): void {
    console.log('✏️ Actualizando campaña...');
    this.campaniaService.update(this.campania.idCam, this.campania).subscribe({
      next: () => {
        console.log('✅ Campaña actualizada exitosamente');
        Swal.fire('Actualizado', 'Campaña actualizada correctamente', 'success');
        this.router.navigate(['/campanias']);
      },
      error: (err) => {
        console.error('❌ Error al actualizar campaña:', err);
        Swal.fire('Error', this.getErrorMessage(err), 'error');
      }
    });
  }

  getErrorMessage(error: any): string {
    if (error.status === 0) return 'No se pudo conectar con el servidor';
    if (error.status === 400) return 'Datos inválidos enviados al servidor (400 Bad Request)';
    if (error.status === 403) return 'No tienes permiso para realizar esta acción (403 Forbidden)';
    if (error.status === 404) return 'Recurso no encontrado (404)';
    if (error.status === 500) return 'Error interno del servidor (500)';
    return 'Error desconocido: ' + (error.message || 'sin mensaje');
  }
}