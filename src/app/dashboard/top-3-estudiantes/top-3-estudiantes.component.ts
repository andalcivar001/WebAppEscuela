import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Dashboard } from '../../core/models/dashboard.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
@Component({
  selector: 'app-top-3-estudiantes',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './top-3-estudiantes.component.html',
  styles: ``,
})
export class Top3EstudiantesComponent implements OnInit {
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  datosD?: Dashboard[] = [];

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    plugins: {
      title: {
        // Configuración del título
        display: true, // Mostrar el título
        text: 'Top 3 estudiantes con más cursos', // Texto del título
        font: {
          // Estilo de la fuente del título
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  constructor(
    private _dashboardService: DashboardService,
    private _snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos() {
    this._dashboardService.getTopEstudiantes().subscribe({
      next: (res) => {
        this.datosD = [...res] as Dashboard[];

        // Actualizar las etiquetas del gráfico
        this.barChartData.labels = this.datosD!.map((x) => {
          return x.nombre;
        });

        // Actualizar los datos del gráfico
        const newData: number[] = this.datosD!.map((x) => {
          return x.total;
        });

        // Insertar los nuevos datos en pieChartDatasets
        this.barChartData.datasets = [
          {
            data: this.datosD.map((item) => item.total),
            label: 'Total Curso:',
          },
        ];

        console.log(this.barChartData);
      },
      error: (error) => {
        this._snackBarService.showErrorSnackbar('Error al obtener los datos');
        console.log(error);
      },
    });
  }
}
