import { Component, Input, OnInit,inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    id : new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)])

  });

  firebaseSVC = inject(FirebaseService);
  utilsSVC = inject(UtilsService);
  
  user = {} as User;


  ngOnInit() {
    this.user = this.utilsSVC.getFromLocalStorage('user');
    if(this.product) this.form.setValue(this.product);
  }

  //--- Tomar/seleccionar imagen---
 async takeImage(){
  const dataUrl= (await this.utilsSVC.takePicture()).dataUrl;
  this.form.controls.image.setValue(dataUrl);

}


  submit(){
    if(this.form.valid){
      if(this.product) this.updateProduct();
    else this.createProduct();
    }
  }

  //----Convierte Valores de String a number---
  setNumberInputs(){
    let{soldUnits, price} = this.form.controls;

    if(soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if(price.value) price.setValue(parseFloat(price.value));
  }

    //---Agregar Producto---
  async createProduct() {


      let path = `users/${this.user.uid}/products`

      const loading = await this.utilsSVC.loading();
      await loading.present();

      //-- Subir la imagen y obtener la url ----
      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSVC.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id;

      this.firebaseSVC.addDocument(path,this.form.value).then(async res => {

        this.utilsSVC.dismissModal({success: true});

        this.utilsSVC.presentToast({
          message: 'Producto agregado correctamente',
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

  //---Actualizar Producto---
  async updateProduct() {

      let path = `users/${this.user.uid}/products/${this.product.id}`

      const loading = await this.utilsSVC.loading();
      await loading.present();

      //-- Si cambio la imagen, subir la nueva y obtener la url ----
      if(this.form.value.image !== this.product.image){
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSVC.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSVC.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
      }
      delete this.form.value.id;

      this.firebaseSVC.updateDocument(path,this.form.value).then(async res => {

        this.utilsSVC.dismissModal({success: true});

        this.utilsSVC.presentToast({
          message: 'Producto actualizado exitosamente',
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
