
// profile.page.ts
import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSVC = inject(FirebaseService);
  utilsSVC = inject(UtilsService);
  
  ngOnInit() {
  }
  
  user(): User{
    return this.utilsSVC.getFromLocalStorage('user');
  }

   //--- Tomar/seleccionar imagen---
  async takeImage(){

    let user = this.user();
    let path = `users/${user.uid}`;
    

    const dataUrl= (await this.utilsSVC.takePicture()).dataUrl;
    let imagePath =`${user.uid}/profile`;
    user.image = await this.firebaseSVC.uploadImage(imagePath, dataUrl);
    let userData= {
      email:user.email,
      name:user.name,
      image: user.image,
      uid: user.uid,
      ...user
    };

    const loading = await this.utilsSVC.loading();
    await loading.present();



    
    this.firebaseSVC.updateDocument(path,userData).then(async res => {

      this.utilsSVC.saveInLocalStorage('user', user);

      this.utilsSVC.presentToast({
        message: 'Imagen acutalizada exitosamente',
        duration: 1500,
        color: 'success',
        position:'middle',
        icon: 'checkmark-circle-outline'
      });


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
