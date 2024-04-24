import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  cursoAddress: string = environment.apiRoot + 'cursos';

  constructor(private _http: HttpClient) {}

  getCursos(): Observable<Curso[]> {
    return this._http.get(`${this.cursoAddress}`) as Observable<Curso[]>;
  }

  getCursoId(id: number): Observable<Curso> {
    return this._http.get(`${this.cursoAddress}/${id}`) as Observable<Curso>;
  }

  postCurso(curso: Curso): Observable<Curso> {
    return this._http.post(this.cursoAddress, curso) as Observable<Curso>;
  }

  putCurso(id: number, curso: Curso): Observable<Curso> {
    return this._http.put(
      `${this.cursoAddress}/${id}`,
      curso
    ) as Observable<Curso>;
  }
  deleteCurso(id: number): Observable<Curso> {
    return this._http.delete(`${this.cursoAddress}/${id}`) as Observable<Curso>;
  }
}
