import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('authenticationDialog') authenticationDialog!: ElementRef<HTMLDialogElement>;

  title = 'Teste Quipux';
  usuario = '';
  senha = '';
  authorized = false;
  authFailed = false;


  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }
  
  ngOnInit() {
    const authorizedValue = localStorage.getItem('authorized');
    this.authorized = authorizedValue === 'true';
  }

  openAuthenticationModal() {
    this.authenticationDialog.nativeElement.showModal()
  }

  closeAuthenticationModal() {
    this.authenticationDialog.nativeElement.close();
  }

  authenticate() {
    this.authService.authenticate(this.usuario, this.senha).subscribe(
      (response: any) => {
        this.authFailed = false;
        this.authorized = true;
        localStorage.setItem('authorized', 'true')
        this.authService.setToken(JSON.parse(response).token);
        this.closeAuthenticationModal();
        this.cdr.detectChanges();
      },
      (error) => {
        this.authFailed = true;
        this.authorized = false;
        localStorage.setItem('authorized', 'false')
        this.cdr.detectChanges();
      }
      );
      
  }
}

