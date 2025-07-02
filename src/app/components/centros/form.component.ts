import { Component, OnInit } from '@angular/core';
import { CentroService } from './centro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Centro } from './centro';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Nivel } from './nivel';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule], // Faltaba la coma aquí
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  public centro: Centro = new Centro();
  public titulo: string = 'Crear Centro';
  public niveles: Nivel[] = []; // Array para almacenar los niveles

  constructor(
    private centroService: CentroService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarCentro();  // Cargar el centro si es edición
    this.cargarNiveles(); // Cargar la lista de niveles
  }
  
  cargarNiveles(): void {
    this.centroService.getNiveles().subscribe((niveles) => {
      this.niveles = niveles;
    });
  }
  
  // Crear centro
  create(): void {
    this.centroService.create(this.centro).subscribe((json) => {
      this.router.navigate(['/centros']);
      Swal.fire('Nuevo Centro', `Centro creado: ${json.centro.nombreCen}`, 'success');
    });
  }

  // Cargar centro por ID
  public cargarCentro(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['idCen'];
      if (id) {
        this.centroService.getCentro(id).subscribe((centro) => {
          this.centro = centro;
        });
      }
    });
  }

  // Actualizar centro
  public update(): void {
    this.centroService.update(this.centro).subscribe((json) => {
      this.router.navigate(['/centros']);
      Swal.fire('Centro Actualizado', `Centro actualizado: ${json.centro.nombreCen}`, 'success');
    });
  }

  compararNivel(o1: Nivel, o2: Nivel): boolean {
    return o1?.idNiv === o2?.idNiv;
  }
}
