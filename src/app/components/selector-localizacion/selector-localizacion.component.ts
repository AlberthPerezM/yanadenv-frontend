import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Region } from '../../core/models/region';
import { Provincia } from '../../core/models/provincia';
import { Distrito } from '../../core/models/distrito';
import { Centro } from '../../core/models/centro';
import { LocalizacionService } from '../../core/service/localizacion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selector-localizacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selector-localizacion.component.html',
  styleUrl: './selector-localizacion.component.css'
})
export class LocalizacionSelectorComponent implements OnInit, OnChanges {

  regiones: Region[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];
  centros: Centro[] = [];

  selectedRegionId?: number;
  selectedProvinciaId?: number;
  selectedDistritoId?: number;
  selectedCentroId?: number;

  @Input() centroInicial: number | null = null;
  @Output() centroSeleccionado = new EventEmitter<number>();

  constructor(private localizacionService: LocalizacionService) { }

  ngOnInit(): void {
    this.cargarRegiones(() => {
      if (this.centroInicial) {
        console.log('🟢 Precargando desde ngOnInit con centroInicial:', this.centroInicial);
        this.precargarJerarquiaDesdeCentro(this.centroInicial);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['centroInicial'] && changes['centroInicial'].currentValue) {
      const nuevoCentroId = changes['centroInicial'].currentValue;
      this.cargarRegiones(() => {
        console.log('🔄 Precargando desde ngOnChanges con nuevo centroInicial:', nuevoCentroId);
        this.precargarJerarquiaDesdeCentro(nuevoCentroId);
      });
    }
  }

  cargarRegiones(callback?: () => void): void {
    this.localizacionService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
      if (callback) callback();
    });
  }

  onRegionChange(): void {
    if (this.selectedRegionId != null) {
      this.localizacionService.getProvinciasPorRegion(this.selectedRegionId).subscribe(provincias => {
        this.provincias = provincias;
        this.distritos = [];
        this.centros = [];
        this.selectedProvinciaId = this.selectedDistritoId = this.selectedCentroId = undefined;
      });
    }
  }

  onProvinciaChange(): void {
    if (this.selectedProvinciaId != null) {
      this.localizacionService.getDistritosPorProvincia(this.selectedProvinciaId).subscribe(distritos => {
        this.distritos = distritos;
        this.centros = [];
        this.selectedDistritoId = this.selectedCentroId = undefined;
      });
    }
  }

  onDistritoChange(): void {
    if (this.selectedDistritoId != null) {
      this.localizacionService.getCentrosPorDistrito(this.selectedDistritoId).subscribe(centros => {
        this.centros = centros;
        this.selectedCentroId = undefined;
      });
    }
  }


  onCentroChange(): void {
    console.log("📤 Emitiendo centro desde hijo:", this.selectedCentroId);
    this.centroSeleccionado.emit(this.selectedCentroId);
  }

  precargarJerarquiaDesdeCentro(idCentro: number): void {
    this.localizacionService.getJerarquiaPorCentro(idCentro).subscribe(data => {
      this.selectedRegionId = data.idRegion;
      this.localizacionService.getProvinciasPorRegion(data.idRegion).subscribe(provincias => {
        this.provincias = provincias;
        this.selectedProvinciaId = data.idProvincia;

        this.localizacionService.getDistritosPorProvincia(data.idProvincia).subscribe(distritos => {
          this.distritos = distritos;
          this.selectedDistritoId = data.idDistrito;

          this.localizacionService.getCentrosPorDistrito(data.idDistrito).subscribe(centros => {
            this.centros = centros;
            this.selectedCentroId = data.idCentro;

            this.centroSeleccionado.emit(data.idCentro); // 🔥 MUY IMPORTANTE
          });
        });
      });
    });
  }

}
