import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../shared/module/material.module';
import { SharedModule } from '../../shared/module/shared.module';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AdministradorService } from '../../core/services/administrador.service';
import { Administrador } from '../../core/models/administrador.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  styles: ``,
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  id?: number;
  hide = true;
  hideConfirmacion = true;

  titulo: string = 'Registro de Administrador/Profesor';
  localStorageKey: string = 'login';
  errorMessage = '';
  correo = new FormControl('', [Validators.required, Validators.email]);
  public get frmRegister() {
    return this.form!.controls;
  }
  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _adminsitradorService: AdministradorService,
    private _router: Router,
    private _snackBarService: SnackbarService,
    private _localStorageService: LocalStorageService
  ) {
    this.form = this._formBuilder.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      apellido: ['', [Validators.required, Validators.maxLength(150)]],
      correo: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordValidator],
      ],
      confirmacion: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.id = undefined;
    this.form.reset();
  }

  passwordValidator(control: AbstractControl) {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    const valid = hasNumber && hasUpper && hasSpecial;
    if (!valid) {
      return { invalidPassword: true };
    }
    return null;
  }

  // Método de conveniencia para acceder al control de la contraseña
  get password() {
    return this.form.get('password');
  }

  guardarForm() {
    const { nombre, apellido, correo, password, confirmacion } =
      this.form.value;
    const admin: Administrador = {
      id: this.id!,
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      password: password,
    };

    if (password !== confirmacion) {
      this._snackBarService.showErrorSnackbar(
        'Error el password y la confirmacion no son iguales!'
      );
      return;
    }
    this.crearAdministrador(admin);
  }

  crearAdministrador(admin: Administrador) {
    this._adminsitradorService.postAdministrador(admin).subscribe({
      next: (res) => {
        const admininstrado = { ...res } as Administrador;
        this._snackBarService.showSuccessSnackbar('Registro exitoso!');
        if (admininstrado && admininstrado.id) {
          this._localStorageService.removeItem(this.localStorageKey);
          this._localStorageService.setItem(this.localStorageKey, {
            idAdministrador: admininstrado.id,
            nombre:
              admininstrado.nombre?.trim() +
              ' ' +
              admininstrado.apellido?.trim(),
          });

          this._router.navigateByUrl('/dashboard');
        }
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar(
          'Error al crear los datos del administrador!'
        );
        console.log(error);
      },
    });
  }

  redireccionar() {
    this._router.navigate(['']);
  }
}
