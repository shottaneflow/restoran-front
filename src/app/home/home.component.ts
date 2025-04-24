import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, DatePipe, NgForOf } from '@angular/common';
import { BookingService } from '../services/booking.service';
import { AdminService } from '../services/admin.service';
import { Booking } from '../services/booking.service';
import { FormsModule } from '@angular/forms';
import { MenuService, Menu, Product } from '../services/menu.service';
import { ProductService } from '../services/product.service';
import {Order} from '../order.model';
import {OrderService} from '../services/order.service';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    NgIf,
    DatePipe,
    FormsModule,
    NgForOf,
    CurrencyPipe
  ],
  styleUrls: ['./home.component.css'],
  standalone: true
})
export class HomeComponent {
  // Booking related fields
  bookings: Booking[] = [];
  allBookings: Booking[] = [];
  newBooking: Omit<Booking, 'id'> = {
    date: new Date().toISOString(),
    guestCount: 1
  };
  isBookingFormVisible = false;
  selectedBooking: Booking | null = null;
  isAdminMode = false;
  showAllBookings = false;

  // Menu related fields
  menus: Menu[] = [];
  newMenu: Menu = {name: ''};
  isMenuFormVisible = false;
  selectedMenu: Menu | null = null;

  // Product related fields
  products: Product[] = [];
  newProduct: Product = {productName: '', description: '', price: 0};
  isProductFormVisible = false;
  selectedProduct: Product | null = null;

  // Order related fields
  newOrder: Order = {
    date: new Date().toISOString(),
    client: {id: JSON.parse(localStorage.getItem('user') || '{}').id},
    products: []
  };
  isOrderFormVisible = false;
  selectedProducts: Product[] = [];

  orders: Order[] = [];
  selectedOrder: Order | null = null;


  constructor(
    private router: Router,
    private bookingService: BookingService,
    private adminService: AdminService,
    private menuService: MenuService,
    private productService: ProductService,
    private orderService: OrderService
  ) {
    this.checkAdminStatus();
    this.loadBookings();
    this.loadMenus();
    this.loadUserOrders();
  }

  checkAdminStatus() {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    this.isAdminMode = roles.includes('ROLE_ADMIN');
  }

  loadBookings() {
    if (this.showAllBookings && this.isAdminMode) {
      this.loadAllBookings();
    } else {
      this.bookingService.getBookings().subscribe({
        next: (bookings) => this.bookings = bookings,
        error: (err) => console.error('Failed to load bookings:', err)
      });
    }
  }

  loadAllBookings() {
    this.adminService.getAllBookings().subscribe({
      next: (bookings) => {
        this.allBookings = bookings;
        this.bookings = bookings; // Для совместимости с текущим шаблоном
      },
      error: (err) => console.error('Failed to load all bookings:', err)
    });
  }

  toggleAllBookings() {
    this.showAllBookings = !this.showAllBookings;
    this.loadBookings();
  }

  // Остальные методы остаются без изменений
  createBooking() {
    if (!this.newBooking.date || !this.newBooking.guestCount) return;

    this.bookingService.createBooking(this.newBooking).subscribe({
      next: () => {
        this.loadBookings();
        this.resetNewBookingForm();
        this.isBookingFormVisible = false;
      },
      error: (err) => console.error('Failed to create booking:', err)
    });
  }

  updateBooking() {
    if (!this.selectedBooking?.id) return;

    this.bookingService.updateBooking(this.selectedBooking.id, this.selectedBooking).subscribe({
      next: () => {
        this.loadBookings();
        this.selectedBooking = null;
      },
      error: (err) => console.error('Failed to update booking:', err)
    });
  }

  deleteBooking(id: string) {
    if (!id) return;

    this.bookingService.deleteBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Failed to delete booking:', err)
    });
  }

  showEditForm(booking: Booking) {
    this.selectedBooking = {...booking};
  }

  resetNewBookingForm() {
    this.newBooking = {
      date: new Date().toISOString(),
      guestCount: 1
    };
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    this.router.navigate(['/login']);
  }

  // Menu methods
  loadMenus() {
    this.menuService.getAllMenus().subscribe({
      next: (menus) => this.menus = menus,
      error: (err) => console.error('Failed to load menus:', err)
    });
  }

  createMenu() {
    this.menuService.createMenu(this.newMenu).subscribe({
      next: () => {
        this.loadMenus();
        this.resetMenuForm();
      },
      error: (err) => console.error('Failed to create menu:', err)
    });
  }

  deleteMenu(id: string) {
    this.menuService.deleteMenu(id).subscribe({
      next: () => {
        this.loadMenus();
        if (this.selectedMenu?.id === id) {
          this.selectedMenu = null;
          this.products = [];
        }
      },
      error: (err) => console.error('Failed to delete menu:', err)
    });
  }

  selectMenu(menu: Menu) {
    this.selectedMenu = menu;
    this.loadProducts(menu.id!);
  }

  // Product methods
  loadProducts(menuId: string) {
    this.productService.getProductsByMenu(menuId).subscribe({
      next: (products) => this.products = products,
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  addProduct() {
    if (!this.selectedMenu?.id || !this.newProduct.productName) return;

    this.productService.addProductToMenu(this.selectedMenu.id, this.newProduct)
      .subscribe({
        next: () => {
          this.loadProducts(this.selectedMenu!.id!);
          this.resetProductForm();
        },
        error: (err) => console.error('Failed to add product:', err)
      });
  }

  updateProduct() {
    if (!this.selectedMenu?.id || !this.selectedProduct?.productName) return;

    this.productService.updateProduct(
      this.selectedMenu.id,
      this.selectedProduct.productName,
      this.selectedProduct
    ).subscribe({
      next: () => {
        this.loadProducts(this.selectedMenu!.id!);
        this.selectedProduct = null;
      },
      error: (err) => console.error('Failed to update product:', err)
    });
  }

  deleteProduct(productName: string) {
    if (!this.selectedMenu?.id) return;

    this.productService.deleteProduct(this.selectedMenu.id, productName)
      .subscribe({
        next: () => this.loadProducts(this.selectedMenu!.id!),
        error: (err) => console.error('Failed to delete product:', err)
      });
  }

  showEditProductForm(product: Product) {
    console.log('Editing product:', product);
    this.selectedProduct = {...product};
    this.isProductFormVisible = true;
  }

  // Helper methods
  // Helper methods
  resetMenuForm() {
    this.newMenu = {name: ''};
    this.isMenuFormVisible = false;
  }

  resetProductForm() {
    this.newProduct = {productName: '', description: '', price: 0};
    this.isProductFormVisible = false;
  }











  toggleProductSelection(product: Product) {
    const index = this.selectedProducts.findIndex(p => p.productName === product.productName);
    if (index >= 0) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(product);
    }
  }

// Создание заказа
  createOrder() {
    if (!this.selectedProducts.length) return;



    const newOrder: Order = {
      date: new Date().toISOString(),
      client: { id: "" },
      products: this.selectedProducts
    };

    this.orderService.createOrder(newOrder).subscribe({
      next: () => {
        this.selectedProducts = [];
        this.isOrderFormVisible = false;
        alert('Order successfully created!');
      },
      error: (err) => console.error('Failed to create order:', err)
    });
  }
  loadUserOrders() {


    this.orderService.getUserOrders().subscribe({
      next: (orders) => this.orders = orders,
      error: (err) => console.error('Failed to load user orders:', err)
    });
  }
  updateOrder() {
    if (!this.selectedOrder || !this.selectedOrder.id) return;

    this.orderService.updateOrder(this.selectedOrder.id, this.selectedOrder).subscribe({
      next: () => {
        this.loadUserOrders();
        this.selectedOrder = null;
        alert('Order updated successfully!');
      },
      error: (err) => console.error('Failed to update order:', err)
    });
  }
  deleteOrder(id: string) {
    if (!id) return;

    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.loadUserOrders();
        alert('Order deleted successfully!');
      },
      error: (err) => console.error('Failed to delete order:', err)
    });
  }
  editOrder(order: Order) {
    this.selectedOrder = { ...order };
  }

}

