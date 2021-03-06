import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,Events } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@IonicPage({})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchQuery: string = "";
  WooCommerce: any;
  products: any[] = [];
  page: number = 2;
  loader:boolean;

  constructor(public events:Events, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, private WP: WoocommerceProvider) {
    console.log(this.navParams.get("searchQuery"));
    this.loader=true;
    this.searchQuery = this.navParams.get("searchQuery");

    this.WooCommerce = WP.init();

    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery).then((searchData) => {
      this.products = JSON.parse(searchData.body).products;

      this.loader=false;
    });


  }
 
  ionViewDidLeave()
  {
    console.log("Page did leave now");
    this.events.publish("close:search");
  }

  ionViewWillLeave()
  {
    console.log("Page will leave now");
    // this.events.publish("close:search");
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  loadMoreProducts(event){

    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery + "&page=" + this.page).then((searchData) => {
      this.products = this.products.concat(JSON.parse(searchData.body).products);

      if(JSON.parse(searchData.body).products.length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();

      }

      event.complete();
      this.page ++;

    });
  }

}
