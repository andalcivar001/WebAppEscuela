import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { CursoEstudiante } from '../../../core/models/curso-estudiante.model';
import { Curso } from '../../../core/models/curso.model';
import { CursoService } from '../../../core/services/curso.service';
import { MatIcon } from '@angular/material/icon';
import { MaterialModule } from '../../../shared/module/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { CursoEstudianteService } from '../../../core/services/curso-estudiante.service';

export interface DialgoCursosAsociadosParams {
  idEstudiante: number;
  nombreEstudiante: string;
  cedula: string;
}

@Component({
  selector: 'app-dialog-cursos-asociados',
  standalone: true,
  imports: [MatIcon, MaterialModule, MatPaginator, MatSort, MatDialogModule],
  templateUrl: './dialog-cursos-asociados.component.html',
  styleUrl: './dialog-cursos-asociados.component.css',
})
export class DialogCursosAsociadosComponent implements OnInit {
  fileInputFormGroup = new FormGroup({
    fileInput: new FormControl(),
  });
  cursos: Curso[] = [];
  titulo: string = '';
  dataSource!: MatTableDataSource<Curso>;
  selection = new SelectionModel<Curso>(true, []); // Instancia de SelectionModel para manejar la selección de cursos

  idClienteLogin?: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columnasAMostrar = ['id', 'nombre', 'horario', 'tipo', 'fecha', 'checkbox'];
  constructor(
    private _snackBarService: SnackbarService,
    private _cursoService: CursoEstudianteService,

    private dialogRef: MatDialogRef<DialogCursosAsociadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialgoCursosAsociadosParams
  ) {}

  ngOnInit(): void {
    this.titulo = `${this.data.cedula} - ${this.data.nombreEstudiante}  `;
    this.obtenerDatos();
  }

  obtenerDatos() {
    this._cursoService.get(this.data.idEstudiante).subscribe({
      next: (res) => {
        this.cursos = [...res];
        this.dataSource = new MatTableDataSource(this.cursos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        const cursosSel = this.cursos.filter((x) => x.checkbox == 'S');
        cursosSel.forEach((row) => this.selection.select(row));
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error la recuperar los datos de cursos'
        );
        console.log(error);
      },
    });
  }

  onSubmit() {
    const cursosGuardar: Curso[] = [...this.selection.selected] as Curso[];
    console.log(cursosGuardar);
    this._cursoService
      .putCurso(this.data.idEstudiante, cursosGuardar)
      .subscribe({
        next: (res) => {
          this._snackBarService.showSuccessSnackbar(
            'Datos Guardados con exito!'
          );
          this.dialogRef.close(this.data.cedula);
        },
        error: (error) => {
          this._snackBarService.showErrorSnackbar(
            'Error la recuperar los datos de cursos'
          );
          console.log(error);
        },
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  // Método para verificar si todos los cursos están seleccionados
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // Método para alternar la selección de todos los cursos
  toggleAllSelection() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  // Método para alternar la selección de un curso individual
  toggleSelection(curso: Curso) {
    this.selection.toggle(curso);
  }
}
