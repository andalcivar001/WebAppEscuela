import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Estudiante } from '../../../core/models/estudiante.model';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { MaterialModule } from '../../../shared/module/material.module';
import { SharedModule } from '../../../shared/module/shared.module';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-form-estudiante',
  standalone: true,
  imports: [MaterialModule, SharedModule, NavbarComponent],
  templateUrl: './form-estudiante.component.html',
  styleUrl: `./form-estudiante.component.css`,
})
export class FormEstudianteComponent {
  form: FormGroup;
  id?: number;
  hide = true;
  titulo: string = 'Mantenimiento de estudiante';

  public get frmDatos() {
    return this.form!.controls;
  }
  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _snackBarService: SnackbarService,
    private _estudianteService: EstudianteService
  ) {
    this.form = this._formBuilder.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      apellido: ['', [Validators.required, Validators.maxLength(150)]],
      edad: ['', [Validators.required]],
      cedula: ['', [Validators.required, Validators.maxLength(11)]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((data) => {
      const { idEstudiante } = data;

      if (idEstudiante) {
        this.id = idEstudiante;
        if (this.id && this.id > 0) {
          this._estudianteService.getEstudianteId(this.id).subscribe({
            next: (res) => {
              this.titulo = `Editando estudiante - ${this.id} ${res.nombre} ${res.apellido}`;
              const dato = { ...res } as Estudiante;

              this.form.patchValue(dato);
              this.frmDatos['id'].disable();
            },
            error: (error) => {
              this._snackBarService.showErrorSnackbar(
                'Error al cargar datos del estudiante'
              );
              console.log(error);
            },
          });
        } else {
          this.id = undefined;
          this.titulo = 'Creando estudiante';
          this.form.reset();
        }
      }
    });
  }

  guardarForm() {
    const { nombre, apellido, edad, cedula, correo } = this.form.value;
    const datos: Estudiante = {
      id: this.id!,
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      cedula: cedula,
      correo: correo,
    };

    if (this.id && this.id > 0) {
      this.editarEstudiante(datos);
    } else {
      this.crearEstudiante(datos);
    }
  }

  crearEstudiante(data: Estudiante) {
    this._estudianteService.postEstudiante(data).subscribe({
      next: (res) => {
        this._snackBarService.showSuccessSnackbar(
          'estudiante creado con exito!'
        );
        this.redireccionarGrid();
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error al crear los datos del estudiante!'
        );
        console.log(error);
      },
    });
  }

  editarEstudiante(data: Estudiante) {
    this._estudianteService.putEstudiante(data.id, data).subscribe({
      next: (res) => {
        this._snackBarService.showSuccessSnackbar(
          'Estudiante editado con exito!'
        );
        this.redireccionarGrid();
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error al actuarlizar los datos del estudiante!'
        );
        console.log(error);
      },
    });
  }

  redireccionarGrid() {
    this._router.navigate(['/admin/estudiantes']);
  }
}
