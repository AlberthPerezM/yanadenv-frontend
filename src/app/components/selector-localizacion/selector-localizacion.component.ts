import { Component, OnInit } from '@angular/core';
import { Region } from '../../core/models/region';
import { Provincia } from '../../core/models/provincia';
import { Distrito } from '../../core/models/distrito';
import { LocalizacionService } from '../../core/service/localizacion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-selector-localizacion',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './selector-localizacion.component.html',
  styleUrl: './selector-localizacion.component.css'
})
export class LocalizacionSelectorComponent implements OnInit {

  regiones: Region[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];

  selectedRegionId?: number;
  selectedProvinciaId?: number;
  selectedDistritoId?: number;

  constructor(private localizacionService: LocalizacionService) {}

  ngOnInit(): void {
    this.cargarRegiones();
  }

  cargarRegiones(): void {
    this.localizacionService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    });
  }

  onRegionChange(): void {
    if (this.selectedRegionId != null) {
      this.localizacionService.getProvinciasPorRegion(this.selectedRegionId).subscribe(provincias => {
        this.provincias = provincias;
        this.distritos = [];
        this.selectedProvinciaId = undefined;
        this.selectedDistritoId = undefined;
      });
    } else {
      this.provincias = [];
      this.distritos = [];
      this.selectedProvinciaId = undefined;
      this.selectedDistritoId = undefined;
    }
  }

  onProvinciaChange(): void {
    if (this.selectedProvinciaId != null) {
      this.localizacionService.getDistritosPorProvincia(this.selectedProvinciaId).subscribe(distritos => {
        this.distritos = distritos;
        this.selectedDistritoId = undefined;
      });
    } else {
      this.distritos = [];
      this.selectedDistritoId = undefined;
    }
  }

}