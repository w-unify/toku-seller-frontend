import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'toku-seller-angular';
}