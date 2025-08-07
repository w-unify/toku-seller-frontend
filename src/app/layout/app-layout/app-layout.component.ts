import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

declare const HSStaticMethods: any;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent implements AfterViewInit, OnDestroy {
  private routerSubscription: Subscription;
  private scriptsLoaded: boolean = false;

  constructor(private router: Router, private renderer: Renderer2) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.scriptsLoaded) {
        setTimeout(() => {
          this.initializePreline();
        }, 50);
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadScriptsSequentially([
      '/libs/@popperjs/core/umd/popper.min.js',
      '/libs/preline/preline.js',
      '/js/defaultmenu.min.js'
    ]).then(() => {
      this.scriptsLoaded = true;
      this.initializePreline();
    }).catch(error => {
      console.error('Error al cargar los scripts:', error);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Carga secuencial de scripts para evitar conflictos de dependencias.
   * Retorna una Promise que se resuelve cuando todos los scripts han sido cargados.
   */
  private loadScriptsSequentially(urls: string[], index: number = 0): Promise<void> {
    if (index >= urls.length) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      script.src = urls[index];
      script.type = 'text/javascript';
      script.defer = true; 

      script.onload = () => {
        console.log(`Script cargado: ${urls[index]}`);
        this.loadScriptsSequentially(urls, index + 1)
          .then(resolve)
          .catch(reject);
      };

      script.onerror = (error: Event) => {
        console.error(`Error al cargar el script: ${urls[index]}`, error);
        reject(new Error(`Failed to load script: ${urls[index]}`));
      };

      this.renderer.appendChild(document.body, script);
    });
  }

  /**
   * Inicializa las librerías de terceros que requieren una llamada explícita.
   */
  private initializePreline(): void {
    if (typeof HSStaticMethods !== 'undefined' && HSStaticMethods.autoInit) {
      console.log('Inicializando Preline.js...');
      HSStaticMethods.autoInit();
    } else {
      console.warn('HSStaticMethods (Preline.js) no está disponible. Asegúrate de que preline.js se haya cargado correctamente.');
    }
  }
}
