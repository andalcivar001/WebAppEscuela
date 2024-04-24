import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { MatIcon } from '@angular/material/icon';
import { MaterialModule } from '../../../shared/module/material.module';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Estudiante } from '../../../core/models/estudiante.model';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  DialgoCursosAsociadosParams,
  DialogCursosAsociadosComponent,
} from '../dialog-cursos-asociados/dialog-cursos-asociados.component';
@Component({
  selector: 'app-grid-estudiante',
  standalone: true,
  imports: [MatIcon, MaterialModule, NavbarComponent, MatPaginator, MatSort],
  templateUrl: './grid-estudiante.component.html',
  styles: ``,
})
export class GridEstudianteComponent implements OnInit {
  estudiantes: Estudiante[] = [];

  dataSource!: MatTableDataSource<Estudiante>;
  idClienteLogin?: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columnasAMostrar = [
    'id',
    'nombre',
    'apellido',
    'edad',
    'cedula',
    'correo',
    'acciones',
  ];
  constructor(
    private _estudianteService: EstudianteService,
    private _router: Router,
    private _snackBarService: SnackbarService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos() {
    this._estudianteService.getEstudiantes().subscribe({
      next: (res) => {
        this.estudiantes = [...res];
        this.dataSource = new MatTableDataSource(this.estudiantes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error la recuperar los datos de estudiantes'
        );
        console.log(error);
      },
    });
  }

  filtrarGrid(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  crearEstudiante() {
    this._router.navigate(['estudianteForm'], {
      relativeTo: this.activatedRoute,
    });
  }

  editarEstudiante(id: number) {
    const idEstudiante = id;

    this._router.navigate(['estudianteForm'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        idEstudiante,
      },
    });
  }

  eliminarEstudiante(id: number) {
    this._estudianteService.deleteEstudiante(id).subscribe({
      next: (res) => {
        this.obtenerDatos();
        this._snackBarService.showSuccessSnackbar(
          'estudiante eliminado con exito!'
        );
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error al eliminar el registro'
        );
        console.log(error);
      },
    });
  }

  asignarCursos(id: number, nombre: string, apellido: string, cedula: string) {
    let dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '80 %';
    dialogConfig.width = '100%';

    const data: DialgoCursosAsociadosParams = {
      idEstudiante: id,
      nombreEstudiante: nombre + ' ' + apellido,
      cedula: cedula,
    };

    dialogConfig.data = data;

    dialogConfig = { ...dialogConfig };

    const dialogRef = this.dialog.open(
      DialogCursosAsociadosComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((cursos) => {
      console.log(cursos);
    });
  }
}
