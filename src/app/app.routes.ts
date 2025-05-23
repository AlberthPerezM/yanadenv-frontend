import { Routes } from '@angular/router';
import { CentrosComponent } from './centros/centros.component';
import { FormComponent } from './centros/form.component';
import { FormParticipanteComponent } from './participante/formParticipante.component';
import { ParticipantesComponent } from './participante/participante.component';
import { ApoderadosComponent } from './apoderado/apoderado.component';
import { FormApoderadoComponent } from './apoderado/form-apoderado.component';
import { ExamenLaboratorioComponent } from './examen-laboratorio/examen-laboratorio.component';
import { FormExamenLaboratorioComponent } from './examen-laboratorio/form-examen-laboratorio.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DatoClinicoComponent } from './dato-clinico/dato-clinico.component';
import { FormDatoClinicoComponent } from './dato-clinico/form-dato-clinico.component';

export const routes: Routes = [
 /* { path: '', redirectTo: '/sidebar', pathMatch: 'full' },
  { path: 'centros', component: CentrosComponent },
  { path: 'centros/form', component: FormComponent },
  { path: 'centros/form/:idCen', component: FormComponent },

  //Participantes
  { path: 'participantes', component: ParticipantesComponent },
  { path: 'participantes/form', component:FormParticipanteComponent },
  { path: 'participantes/form/:idPar', component: FormParticipanteComponent },

  //Apoderados
  { path: 'apoderados', component: ApoderadosComponent },
  { path: 'apoderados/form', component: FormApoderadoComponent },
  { path: 'apoderados/form/:idApo', component: FormApoderadoComponent },
  { path: 'apoderados/form/:idPar', component: FormApoderadoComponent },
  { path: 'apoderados/form/:idApo/:idPar', component: FormApoderadoComponent},

  //Examen laboratorio
  { path: 'examenes', component: ExamenLaboratorioComponent },
  { path: 'examenes/form', component: FormExamenLaboratorioComponent },
  { path: 'examenes/form/:idExa', component: FormExamenLaboratorioComponent },


  //Componentes
  { path: 'sidebar', component: SidebarComponent },
  { path: 'header', component: HeaderComponent },

*/

  {
    path: '',
    component: LayoutComponent,
    children: [
      //participantes
      { path: 'participantes', component: ParticipantesComponent},
      { path: 'participantes/form', component:FormParticipanteComponent },
      { path: 'participantes/form/:idPar', component: FormParticipanteComponent },

      //apoderado

      { path: 'apoderados', component: ApoderadosComponent },
      { path: 'apoderados/form', component: FormApoderadoComponent },
      { path: 'apoderados/form/:idApo', component: FormApoderadoComponent },
      { path: 'apoderados/form/:idPar', component: FormApoderadoComponent },
      { path: 'apoderados/form/:idApo/:idPar', component: FormApoderadoComponent},
      

      //Examen laboratorio
    
      { path: 'examenes', component: ExamenLaboratorioComponent },
      { path: 'examenes/form', component: FormExamenLaboratorioComponent },
      { path: 'examenes/form/:idPar', component: FormExamenLaboratorioComponent },
       
      //DatoClinico
      { path: 'datoclinicos', component: DatoClinicoComponent },
      { path: 'datoclinicos/form', component: FormDatoClinicoComponent },
      { path: 'datoclinicos/form/:idDat', component: FormDatoClinicoComponent },

      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  { path: 'sidebar', component: SidebarComponent },
  { path: 'header', component: HeaderComponent },

  {
    path: '**',
    redirectTo: 'dashboard'
  }


];
