import { ChangeDetectionStrategy, Component, OnInit, Renderer2 } from '@angular/core';
@Component({
  selector: 'app-dashboard-seller',
  standalone:true,
  imports: [],
  templateUrl: './dashboard-seller.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardSellerComponent implements OnInit {
   constructor(private renderer: Renderer2) { }
ngOnInit(): void {
    this.loadScriptsSequentially([
      '/libs/apexcharts/apexcharts.min.js',
      '/js/ecommerce-dashboard.js'
    ]);
  }

  // Carga secuencial de scripts para evitar conflictos de dependencias
  loadScriptsSequentially(urls: string[], index: number = 0): void {
    if (index >= urls.length) return;

    const script = this.renderer.createElement('script');
    script.src = urls[index];
    script.type = 'text/javascript';
    script.defer = true;
    script.onload = () => this.loadScriptsSequentially(urls, index + 1);
    this.renderer.appendChild(document.body, script);
  }
}
