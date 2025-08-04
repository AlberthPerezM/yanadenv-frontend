import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

import { ParticipantesComponent } from './components/participante/participante.component';
import { FormParticipanteComponent } from './components/participante/formParticipante.component';

import { ApoderadosComponent } from './components/apoderado/apoderado.component';
import { FormApoderadoComponent } from './components/apoderado/form-apoderado.component';

import { ExamenLaboratorioComponent } from './components/examen-laboratorio/examen-laboratorio.component';
import { FormExamenLaboratorioComponent } from './components/examen-laboratorio/form-examen-laboratorio.component';

import { DatoClinicoComponent } from './components/dato-clinico/dato-clinico.component';
import { FormDatoClinicoComponent } from './components/dato-clinico/form-dato-clinico.component';

import { UserComponent } from './components/user/user.component';
import { UserFormComponent } from './components/user/user-form.component';
import { AuthComponent } from './components/auth/auth.component';
import { Forbidden403Component } from './components/forbidden403/forbidden403.component';

import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { LocalizacionSelectorComponent } from './components/selector-localizacion/selector-localizacion.component';

export const routes: Routes = [

  // RUTA PÚBLICA: login (SIN layout, SIN sidebar ni header)
  { path: 'login', component: AuthComponent },

  // RUTA PARA ERROR 403
  { path: 'forbidden', component: Forbidden403Component },

  // RUTAS PRIVADAS (con layout, header y sidebar)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      // Participantes
      { path: 'participantes', component: ParticipantesComponent },
      { path: 'participantes/form', component: FormParticipanteComponent },
      { path: 'participantes/form/:idPar', component: FormParticipanteComponent },

      // Apoderados
      { path: 'apoderados', component: ApoderadosComponent },
      { path: 'apoderados/form', component: FormApoderadoComponent },
      { path: 'apoderados/form/:idApo', component: FormApoderadoComponent },
      { path: 'apoderados/form/:idApo/:idPar', component: FormApoderadoComponent },

      // Exámenes
      { path: 'examenes', component: ExamenLaboratorioComponent },
      { path: 'examenes/form', component: FormExamenLaboratorioComponent },
      { path: 'examenes/form/:idPar', component: FormExamenLaboratorioComponent },

      // Datos clínicos
      { path: 'datoclinicos', component: DatoClinicoComponent },
      { path: 'datoclinicos/form', component: FormDatoClinicoComponent },
      { path: 'datoclinicos/form/:idPar', component: FormDatoClinicoComponent },

      // Usuarios
      { path: 'users', component: UserComponent },
      { path: 'users/page/:page', component: UserComponent },
      { path: 'users/create', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent },

      //Localización
      { path: 'localizaciones', component: LocalizacionSelectorComponent },
      { path: 'datoclinicos/form/:idDat', component: FormDatoClinicoComponent },
      { path: 'datoclinicos/form/edit/:idDat', component: FormDatoClinicoComponent }

    ]
  },

  // RUTA COMODÍN
  { path: '**', redirectTo: 'dashboard' }
];
