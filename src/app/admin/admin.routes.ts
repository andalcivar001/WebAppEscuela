import { Routes } from '@angular/router';
import { GridCursoComponent } from './curso/grid-curso/grid-curso.component';
import { FormCursoComponent } from './curso/form-curso/form-curso.component';
import { GridEstudianteComponent } from './estudiante/grid-estudiante/grid-estudiante.component';
import { FormEstudianteComponent } from './estudiante/form-estudiante/form-estudiante.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: GridCursoComponent },

  { path: 'cursos', component: GridCursoComponent },
  { path: 'cursos/cursoForm', component: FormCursoComponent },
  { path: 'estudiantes', component: GridEstudianteComponent },
  { path: 'estudiantes/estudianteForm', component: FormEstudianteComponent },
];
