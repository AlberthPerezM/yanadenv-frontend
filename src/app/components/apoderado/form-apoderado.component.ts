import { Component, OnInit } from '@angular/core';
import { ApoderadoService } from '../../core/service/apoderado.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ParticipanteService } from '../../core/service/participante.service';
import { Participante } from '../../core/models/participante';
import { Apoderado } from '../../core/models/apoderado';

@Component({
  selector: 'app-form-apoderado',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-apoderado.component.html',
})
export class FormApoderadoComponent implements OnInit {
  public apoderado: Apoderado = new Apoderado();
  public titulo: string = 'Apoderado';
  public participantes: Participante[] = [];
  idParticipante: number | null = null;
  nivelSeleccionado: any;


  constructor(
    private apoderadoService: ApoderadoService,
    private participanteService: ParticipanteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.cargarApoderado();
    this.cargarParticipantes();
    this.participanteSeleccionado();
    this.activatedRoute.queryParams.subscribe(params => {
      this.idParticipante = params['idParticipante'] ? Number(params['idParticipante']) : null;
      console.log("ID del participante recibido:", this.idParticipante);
    });
  }

  //Nivel seleccionado nos ayuda con los combobox
  participanteSeleccionado(): void {
    this.nivelSeleccionado = this.idParticipante !== undefined ? this.idParticipante : this.apoderado.participante;
  }
  cargarParticipantes(): void {
    this.participanteService.getParticipantes().subscribe((participantes) => {
      this.participantes = participantes;
      // Si hay un idParticipante en la URL, buscar el participante correspondiente
      if (this.idParticipante) {
        const participanteEncontrado = this.participantes.find(p => p.idPar === this.idParticipante);
        if (participanteEncontrado) {
          this.apoderado.participante = participanteEncontrado;
        }
      }
      // Si no hay un idParticipante o no se encontró, asignar el primer participante disponible
      if (!this.apoderado.participante && this.participantes.length > 0) {
        this.apoderado.participante = this.participantes[0]; // Toma el primero disponible
      }
    });
  }
  // Crear apoderado
  create(): void {
    this.apoderadoService.create(this.apoderado).subscribe((json) => {
      this.router.navigate(['/apoderados']);
      Swal.fire('Nuevo Apoderado', `Apoderado creado: ${json.apoderado.nombre}`, 'success');
    });
  }
  // Cargar apoderado por ID
  public cargarApoderado(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['idApo'];
      if (id) {
        this.apoderadoService.getApoderado(id).subscribe((apoderado) => {
          this.apoderado = apoderado;
        });
      }
    });
  }
  // Actualizar apoderado
  public update(): void {
    this.apoderadoService.update(this.apoderado).subscribe((json) => {
      this.router.navigate(['/apoderados']);
      Swal.fire('Apoderado Actualizado', `Apoderado actualizado: ${json.apoderado.nombre}`, 'success');
    });
  }
  compararParticipante(o1: Participante | null, o2: Participante | null): boolean {
    return o1?.idPar === o2?.idPar;
  }
}
