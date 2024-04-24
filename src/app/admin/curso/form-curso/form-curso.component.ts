import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Curso } from '../../../core/models/curso.model';
import { CursoService } from '../../../core/services/curso.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MaterialModule } from '../../../shared/module/material.module';
import { SharedModule } from '../../../shared/module/shared.module';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import moment from 'moment';
@Component({
  selector: 'app-form-curso',
  standalone: true,
  imports: [MaterialModule, SharedModule, NavbarComponent],
  templateUrl: './form-curso.component.html',
  styleUrl: `./form-curso.component.css`,
  providers: [provideNativeDateAdapter()],
})
export class FormCursoComponent implements OnInit {
  form: FormGroup;
  id?: number;
  hide = true;
  titulo: string = 'Mantenimiento de Curso';

  public get frmDatos() {
    return this.form!.controls;
  }
  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _snackBarService: SnackbarService,
    private _cursoService: CursoService
  ) {
    this.form = this._formBuilder.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      horario: ['', [Validators.required, Validators.maxLength(150)]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((data) => {
      const { idCurso } = data;

      if (idCurso) {
        this.id = idCurso;
        if (this.id && this.id > 0) {
          this._cursoService.getCursoId(this.id).subscribe({
            next: (res) => {
              this.titulo = `Editando Curso - ${this.id} ${res.nombre} ${res.horario}`;
              const dato = { ...res } as Curso;
              console.log(dato);
              dato.fecha_inicio = new Date(dato.fecha_inicio as Date);

              dato.fecha_fin = new Date(dato.fecha_fin as Date);
              this.form.patchValue(dato);
              this.frmDatos['id'].disable();
            },
            error: (error) => {
              this._snackBarService.showErrorSnackbar(
                'Error al cargar datos del Curso'
              );
              console.log(error);
            },
          });
        } else {
          this.id = undefined;
          this.titulo = 'Creando Curso';
          this.form.reset();
        }
      }
    });
  }

  guardarForm() {
    const { nombre, horario, fecha_inicio, fecha_fin, tipo } = this.form.value;
    const datos: Curso = {
      id: this.id!,
      nombre: nombre,
      horario: horario,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      tipo: tipo,
    };
    datos.fecha_inicio = moment(datos.fecha_inicio as Date).format(
      'YYYY-MM-DD'
    );

    datos.fecha_fin = moment(datos.fecha_fin as Date).format('YYYY-MM-DD');

    if (this.id && this.id > 0) {
      this.editarCurso(datos);
    } else {
      this.crearCurso(datos);
    }
  }

  crearCurso(data: Curso) {
    this._cursoService.postCurso(data).subscribe({
      next: (res) => {
        this._snackBarService.showSuccessSnackbar('Curso creado con exito!');
        this.redireccionarGrid();
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error al crear los datos del Curso!'
        );
        console.log(error);
      },
    });
  }

  editarCurso(data: Curso) {
    this._cursoService.putCurso(data.id, data).subscribe({
      next: (res) => {
        this._snackBarService.showSuccessSnackbar('Curso editado con exito!');
        this.redireccionarGrid();
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error al actuarlizar los datos del Curso!'
        );
        console.log(error);
      },
    });
  }

  redireccionarGrid() {
    this._router.navigate(['/admin/cursos']);
  }
}
