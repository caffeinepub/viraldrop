# ViralDrop Admin Panel

## Current State
The app has a full storefront (hero, product grid, cart, flash sale timer, categories). The backend already has product CRUD (createProduct, updateProduct, deleteProduct, getProducts), authorization with admin/user roles, and cart management. There is no admin UI — the owner has no way to add or manage products from the browser.

## Requested Changes (Diff)

### Add
- Admin Panel page accessible at `/admin` route
- Login with Internet Identity to authenticate as admin
- Dashboard with product list table showing all products
- Add Product form: name, description, price, original price, category, badge, image URL, stock quantity, trending toggle
- Edit Product inline or via modal
- Delete Product with confirmation
- Flash Sale creator: select products, set discount %, set duration in minutes
- Seed Data button to populate sample products
- Stats summary: total products, total categories, active flash sale status
- Navigation link in header to access admin panel (only visible to admins)
- Public site note explaining users can browse freely — no login needed for shopping

### Modify
- App.tsx: add routing so `/admin` shows AdminPage and `/` shows the storefront
- Header: show Admin link if user is admin

### Remove
- Nothing removed

## Implementation Plan
1. Add React Router to App.tsx with two routes: `/` (storefront) and `/admin` (admin panel)
2. Create AdminPage component with Internet Identity login flow
3. After login, check isCallerAdmin() and show admin dashboard or access denied
4. Build ProductTable component: lists all products with edit/delete actions
5. Build ProductForm component: form to add or edit a product
6. Build FlashSaleForm component: select product IDs, discount, duration
7. Wire all forms to backend API (createProduct, updateProduct, deleteProduct, createFlashSale, seedData)
8. Update Header to show Admin link when user is admin
