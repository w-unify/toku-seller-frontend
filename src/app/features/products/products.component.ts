import { ChangeDetectionStrategy, Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-products-seller',
  standalone:true,
  imports: [],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
   constructor(private renderer: Renderer2) { }
ngOnInit(): void {
    this.loadScriptsSequentially([
      '/libs/simplebar/simplebar.min.js',
      '/libs/filepond/filepond.min.js',
      '/libs/filepond-plugin-image-exif-orientation/filepond-plugin-image-exif-orientation.min.js',
      '/libs/filepond-plugin-file-validate-size/filepond-plugin-file-validate-size.min.js',
      '/js/form-wizard-init.js',
      '/libs/filepond-plugin-file-encode/filepond-plugin-file-encode.min.js',
      '/libs/filepond-plugin-image-edit/filepond-plugin-image-edit.min.js',
      '/libs/filepond-plugin-file-validate-type/filepond-plugin-file-validate-type.min.js',
      '/libs/filepond-plugin-image-crop/filepond-plugin-image-crop.min.js',
      '/js/edit-products.js',
      '/js/custom.js',
      


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