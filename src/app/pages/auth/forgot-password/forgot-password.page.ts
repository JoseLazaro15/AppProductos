import { Component, OnInit,inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {


  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  firebaseSVC = inject(FirebaseService);
  utilsSVC = inject(UtilsService);

  ngOnInit() {
  }

  async submit() {
    if(this.form.valid){
      const loading = await this.utilsSVC.loading();
      await loading.present();

      this.firebaseSVC.sendRecoveryEmail(this.form.value.email).then(res => {
        this.utilsSVC.presentToast({
          message: 'Se ha enviado un correo para recuperar tu contraseña',
          duration: 1500,
          color: 'primary',
          position:'middle',
          icon: 'mail-outline'
        });

        this.utilsSVC.routerLink('/auth');
        this.form.reset();  
        
      }).catch((error) => {
        console.log(error);
        this.utilsSVC.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position:'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      })
    }
  }


}