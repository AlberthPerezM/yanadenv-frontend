import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ParticipantesComponent } from './participante/participante.component';
import { FormParticipanteComponent } from './participante/formParticipante.component';

import { ApoderadosComponent } from './apoderado/apoderado.component';
import { FormApoderadoComponent } from './apoderado/form-apoderado.component';

import { ExamenLaboratorioComponent } from './examen-laboratorio/examen-laboratorio.component';
import { FormExamenLaboratorioComponent } from './examen-laboratorio/form-examen-laboratorio.component';

import { DatoClinicoComponent } from './dato-clinico/dato-clinico.component';
import { FormDatoClinicoComponent } from './dato-clinico/form-dato-clinico.component';

import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user/user-form.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [

      // Dashboard
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

      // Exámenes de laboratorio
      { path: 'examenes', component: ExamenLaboratorioComponent },
      { path: 'examenes/form', component: FormExamenLaboratorioComponent },
      { path: 'examenes/form/:idPar', component: FormExamenLaboratorioComponent },

      // Datos clínicos
      { path: 'datoclinicos', component: DatoClinicoComponent },
      { path: 'datoclinicos/form', component: FormDatoClinicoComponent },
      { path: 'datoclinicos/form/:idDat', component: FormDatoClinicoComponent },

      // Usuarios
      { path: 'users', component: UserComponent },
      { path: 'users/page/:page', component: UserComponent },
      { path: 'users/create', component: UserFormComponent, canActivate: [authGuard] },
      { path: 'users/edit/:id', component: UserFormComponent, canActivate: [authGuard] },

      // Login
      { path: 'login', component: AuthComponent }
    ]
  },

  // Componentes sueltos (generalmente no deben tener rutas propias, pero si lo necesitas)
  { path: 'sidebar', component: SidebarComponent },
  { path: 'header', component: HeaderComponent },

  // Ruta comodín
  { path: '**', redirectTo: 'dashboard' }
];
