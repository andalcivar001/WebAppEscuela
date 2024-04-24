import { Component, OnInit } from '@angular/core';
import { Top3EstudiantesComponent } from './top-3-estudiantes/top-3-estudiantes.component';
import { TotalCursoEstudianteComponent } from './total-curso-estudiante/total-curso-estudiante.component';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { Top3CursosComponent } from './top-3-cursos/top-3-cursos.component';
import { SnackbarService } from '../shared/services/snackbar.service';
import { DashboardService } from '../core/services/dashboard.service';
import { Estudiante } from '../core/models/estudiante.model';
import { Curso } from '../core/models/curso.model';
import { EstudianteService } from '../core/services/estudiante.service';
import { CursoService } from '../core/services/curso.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Top3CursosComponent,
    Top3EstudiantesComponent,
    TotalCursoEstudianteComponent,
    NavbarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  cursos: Curso[] = [];
  constructor(
    private _estudianteService: EstudianteService,
    private _cursoService: CursoService,
    private _snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.obtenerEstudiantes();
    this.obtenerCursos();
  }

  obtenerEstudiantes() {
    this._estudianteService.getEstudiantes().subscribe({
      next: (res) => {
        this.estudiantes = [...res] as Estudiante[];
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error al obtener los datos de estudiantes'
        );
        console.log(error);
      },
    });
  }

  obtenerCursos() {
    this._cursoService.getCursos().subscribe({
      next: (res) => {
        this.cursos = [...res] as Curso[];
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error al obtener los datos de cursos'
        );
        console.log(error);
      },
    });
  }
}
