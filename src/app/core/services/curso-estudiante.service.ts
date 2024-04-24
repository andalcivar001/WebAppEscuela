import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root',
})
export class CursoEstudianteService {
  cursoAddress: string = environment.apiRoot + 'cursos-estudiante';

  constructor(private _http: HttpClient) {}

  get(idEstudiante: number): Observable<Curso[]> {
    return this._http.get(`${this.cursoAddress}/${idEstudiante}`) as Observable<
      Curso[]
    >;
  }

  putCurso(id: number, curso: Curso[]): Observable<Curso[]> {
    return this._http.put(`${this.cursoAddress}/${id}`, curso) as Observable<
      Curso[]
    >;
  }
}
