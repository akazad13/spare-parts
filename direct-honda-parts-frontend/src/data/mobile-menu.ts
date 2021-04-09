import { MobileMenuLink } from '../app/interfaces/mobile-menu-link';

export const mobileMenuLinks: MobileMenuLink[] = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'Shop',
    url: '/shop/shop-grid-4-sidebar',
    submenu: [
      {
        title: 'Category',
        url: '/shop/category',
        submenu: [
          {
            title: '3 Columns Sidebar',
            url: '/shop/category-columns-3-sidebar',
          },
          {
            title: '4 Columns Sidebar',
            url: '/shop/category-columns-4-sidebar',
          },
          {
            title: '5 Columns Sidebar',
            url: '/shop/category-columns-5-sidebar',
          },
          { title: '4 Columns Full', url: '/shop/category-columns-4-full' },
          { title: '5 Columns Full', url: '/shop/category-columns-5-full' },
          { title: '6 Columns Full', url: '/shop/category-columns-6-full' },
          { title: '7 Columns Full', url: '/shop/category-columns-7-full' },
          { title: 'Right Sidebar', url: '/shop/category-right-sidebar' },
        ],
      },
      {
        title: 'Shop Grid',
        url: '/shop/shop-grid-4-sidebar',
        submenu: [
          { title: '6 Columns Full', url: '/shop/shop-grid-6-full' },
          { title: '5 Columns Full', url: '/shop/shop-grid-5-full' },
          { title: '4 Columns Full', url: '/shop/shop-grid-4-full' },
          { title: '4 Columns Sidebar', url: '/shop/shop-grid-4-sidebar' },
          { title: '3 Columns Sidebar', url: '/shop/shop-grid-3-sidebar' },
        ],
      },
      { title: 'Shop List', url: '/shop/shop-list' },
      { title: 'Shop Table', url: '/shop/shop-table' },
      { title: 'Shop Right Sidebar', url: '/shop/shop-right-sidebar' },
      {
        title: 'Product',
        url: '/shop/product-full',
        submenu: [
          { title: 'Full Width', url: '/shop/product-full' },
          { title: 'Left Sidebar', url: '/shop/product-sidebar' },
        ],
      },
      { title: 'Cart', url: '/shop/cart' },
      { title: 'Checkout', url: '/shop/checkout' },
      { title: 'Order Success', url: '/shop/order-success' },
      { title: 'Wishlist', url: '/shop/wishlist' },
      { title: 'Compare', url: '/shop/compare' },
      { title: 'Track Order', url: '/shop/track-order' },
    ],
  },
  {
    title: 'Account',
    url: '/account',
    submenu: [
      { title: 'Login & Register', url: '/account/login' },
      { title: 'Dashboard', url: '/account/dashboard' },
      { title: 'Garage', url: '/account/garage' },
      { title: 'Edit Profile', url: '/account/profile' },
      { title: 'Order History', url: '/account/orders' },
      { title: 'Order Details', url: '/account/order-details' },
      { title: 'Address Book', url: '/account/addresses' },
      { title: 'Edit Address', url: '/account/edit-address' },
      { title: 'Change Password', url: '/account/password' },
    ],
  },
  {
    title: 'Pages',
    url: '/site/about-us',
    submenu: [
      { title: 'About Us', url: '/site/about-us' },
      { title: 'Contact Us v1', url: '/site/contact-us-v1' },
      { title: 'Contact Us v2', url: '/site/contact-us-v2' },
      { title: '404', url: '/site/not-found' },
      { title: 'Terms And Conditions', url: '/site/terms' },
      { title: 'FAQ', url: '/site/faq' },
      { title: 'Components', url: '/site/components' },
      { title: 'Typography', url: '/site/typography' },
    ],
  },
];
