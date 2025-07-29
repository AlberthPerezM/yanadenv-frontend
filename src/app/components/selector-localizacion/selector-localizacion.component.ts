import { Component, OnInit } from '@angular/core';
import { Region } from '../../core/models/region';
import { Provincia } from '../../core/models/provincia';
import { Distrito } from '../../core/models/distrito';
import { Centro } from '../../core/models/centro'; // <-- Agregado
import { LocalizacionService } from '../../core/service/localizacion.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgSelectOption } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-selector-localizacion',
  standalone: true,
  imports: [FormsModule, CommonModule,NgSelectModule],
  templateUrl: './selector-localizacion.component.html',
  styleUrl: './selector-localizacion.component.css'
})
export class LocalizacionSelectorComponent implements OnInit {
  regiones: Region[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];
  centros: Centro[] = [];

  selectedRegionId?: number;
  selectedProvinciaId?: number;
  selectedDistritoId?: number;
  selectedCentroId?: number;

  constructor(private localizacionService: LocalizacionService) {}

  ngOnInit(): void {
    this.cargarRegiones();
  }

  cargarRegiones(): void {
    this.localizacionService.getRegiones().subscribe((regiones) => {
      this.regiones = regiones;
    });
  }

  onRegionChange(): void {
    if (this.selectedRegionId != null) {
      this.localizacionService
        .getProvinciasPorRegion(this.selectedRegionId)
        .subscribe((provincias) => {
          this.provincias = provincias;
          this.distritos = [];
          this.centros = [];
          this.selectedProvinciaId = undefined;
          this.selectedDistritoId = undefined;
          this.selectedCentroId = undefined;
        });
    } else {
      this.provincias = [];
      this.distritos = [];
      this.centros = [];
      this.selectedProvinciaId = undefined;
      this.selectedDistritoId = undefined;
      this.selectedCentroId = undefined;
    }
  }

  onProvinciaChange(): void {
    if (this.selectedProvinciaId != null) {
      this.localizacionService
        .getDistritosPorProvincia(this.selectedProvinciaId)
        .subscribe((distritos) => {
          this.distritos = distritos;
          this.centros = [];
          this.selectedDistritoId = undefined;
          this.selectedCentroId = undefined;
        });
    } else {
      this.distritos = [];
      this.centros = [];
      this.selectedDistritoId = undefined;
      this.selectedCentroId = undefined;
    }
  }

  onDistritoChange(): void {
    if (this.selectedDistritoId != null) {
      this.localizacionService
        .getCentrosPorDistrito(this.selectedDistritoId)
        .subscribe((centros) => {
          this.centros = centros;
          this.selectedCentroId = undefined;
        });
    } else {
      this.centros = [];
      this.selectedCentroId = undefined;
    }
  }
}