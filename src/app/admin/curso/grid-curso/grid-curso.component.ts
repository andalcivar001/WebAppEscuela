import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from '../../../core/models/curso.model';
import { CursoService } from '../../../core/services/curso.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { MatIcon } from '@angular/material/icon';
import { MaterialModule } from '../../../shared/module/material.module';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-grid-curso',
  standalone: true,
  imports: [MatIcon, MaterialModule, NavbarComponent, MatPaginator, MatSort],
  templateUrl: './grid-curso.component.html',
  styles: ``,
})
export class GridCursoComponent implements OnInit {
  cursos: Curso[] = [];

  dataSource!: MatTableDataSource<Curso>;
  idClienteLogin?: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnasAMostrar = [
    'id',
    'nombre',
    'horario',
    'fecha_inicio',
    'fecha_fin',
    'tipo',
    'acciones',
  ];

  constructor(
    private _cursoService: CursoService,
    private _router: Router,
    private _snackBarService: SnackbarService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.obtenerDatos();
  }
  obtenerDatos() {
    this._cursoService.getCursos().subscribe({
      next: (res) => {
        this.cursos = [...res];
        this.dataSource = new MatTableDataSource(this.cursos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error la recuperar los datos de cursos'
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
  crearCurso() {
    this._router.navigate(['cursoForm'], {
      relativeTo: this.activatedRoute,
    });
  }

  editarCurso(id: number) {
    const idCurso = id;

    this._router.navigate(['cursoForm'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        idCurso,
      },
    });
  }

  eliminarCurso(id: number) {
    this._cursoService.deleteCurso(id).subscribe({
      next: (res) => {
        this.obtenerDatos();
        this._snackBarService.showSuccessSnackbar('Curso eliminado con exito!');
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error al eliminar el registro'
        );
        console.log(error);
      },
    });
  }
}
