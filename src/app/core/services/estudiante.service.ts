import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Estudiante } from '../models/estudiante.model';

@Injectable({
  providedIn: 'root',
})
export class EstudianteService {
  estudianteAddress: string = environment.apiRoot + 'students';

  constructor(private _http: HttpClient) {}

  getEstudiantes(): Observable<Estudiante[]> {
    return this._http.get(`${this.estudianteAddress}`) as Observable<
      Estudiante[]
    >;
  }

  getEstudianteId(id: number): Observable<Estudiante> {
    return this._http.get(
      `${this.estudianteAddress}/${id}`
    ) as Observable<Estudiante>;
  }

  postEstudiante(Estudiante: Estudiante): Observable<Estudiante> {
    return this._http.post(
      this.estudianteAddress,
      Estudiante
    ) as Observable<Estudiante>;
  }

  putEstudiante(id: number, Estudiante: Estudiante): Observable<Estudiante> {
    return this._http.put(
      `${this.estudianteAddress}/${id}`,
      Estudiante
    ) as Observable<Estudiante>;
  }
  deleteEstudiante(id: number): Observable<Estudiante> {
    return this._http.delete(
      `${this.estudianteAddress}/${id}`
    ) as Observable<Estudiante>;
  }
}
