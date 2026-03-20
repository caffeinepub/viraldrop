import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  module CartItem {
    public func compare(cartItem1 : CartItem, cartItem2 : CartItem) : Order.Order {
      switch (Nat.compare(cartItem1.productId, cartItem2.productId)) {
        case (#equal) { Nat.compare(cartItem1.quantity, cartItem2.quantity) };
        case (order) { order };
      };
    };
  };

  module Cart {
    public func compare(cart1 : Cart, cart2 : Cart) : Order.Order {
      Principal.compare(cart1.user, cart2.user);
    };
  };

  module CartMap {
    public func compareBySize(cartMap1 : Map.Map<Nat, CartItem>, cartMap2 : Map.Map<Nat, CartItem>) : Order.Order {
      Nat.compare(cartMap1.size(), cartMap2.size());
    };
  };

  type ProductCategory = {
    #techGadgets;
    #homeEssentials;
    #fashion;
    #petGear;
  };

  type ProductBadge = {
    #hot;
    #viral;
    #new;
    #sale;
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    originalPrice : ?Nat;
    category : ProductCategory;
    rating : Float;
    reviewCount : Nat;
    badge : ?ProductBadge;
    imageUrl : Text;
    inStock : Nat;
    isTrending : Bool;
  };

  type FlashSale = {
    productIds : [Nat];
    discountPercent : Nat;
    endTime : Time.Time;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type Cart = {
    user : Principal;
    items : Map.Map<Nat, CartItem>;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    shippingAddress : Text;
  };

  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, Cart>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProductId = 1;
  var activeFlashSale : ?FlashSale = null;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function for seeded products
  func seededProduct(
    name : Text,
    description : Text,
    price : Nat,
    category : ProductCategory,
    rating : Float,
    badge : ProductBadge,
    imageUrl : Text,
    inStock : Nat,
    isTrending : Bool,
  ) : Product {
    let product = {
      id = nextProductId;
      name;
      description;
      price;
      originalPrice = null;
      category;
      rating;
      reviewCount = 0;
      badge = ?badge;
      imageUrl;
      inStock;
      isTrending;
    };
    nextProductId += 1;
    product;
  };

  // Seed sample trending products (admin only)
  public shared ({ caller }) func seedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed data");
    };
    switch (activeFlashSale) {
      case (null) {};
      case (?_) { Runtime.trap("Cannot reseed data if flash sale is not expired") };
    };
    products.clear();
    nextProductId := 1;

    let trendingProducts = List.fromArray<Product>([
      seededProduct(
        "Smart Water Bottle",
        "Track your daily hydration with this tech-enabled bottle.",
        2999,
        #techGadgets,
        4.5,
        #hot,
        "https://example.com/smart-bottle.jpg",
        100,
        true,
      ),
      seededProduct(
        "Wireless Earbuds Pro",
        "Experience true wireless freedom with noise cancellation.",
        8999,
        #techGadgets,
        4.7,
        #viral,
        "https://example.com/earbuds.jpg",
        50,
        true,
      ),
      seededProduct(
        "Portable Blender",
        "Make smoothies on the go with this compact blender.",
        4999,
        #homeEssentials,
        4.3,
        #new,
        "https://example.com/blender.jpg",
        80,
        true,
      ),
      seededProduct(
        "Aromatherapy Diffuser",
        "Create a relaxing atmosphere with essential oils.",
        2499,
        #homeEssentials,
        4.6,
        #sale,
        "https://example.com/diffuser.jpg",
        120,
        true,
      ),
      seededProduct(
        "Fitness Tracker Watch",
        "Monitor your health and fitness with smart features.",
        5999,
        #techGadgets,
        4.4,
        #viral,
        "https://example.com/fitness-tracker.jpg",
        70,
        true,
      ),
      seededProduct(
        "Pet Hair Remover",
        "Keep your home fur-free with this reusable tool.",
        1499,
        #petGear,
        4.8,
        #hot,
        "https://example.com/pet-hair.jpg",
        200,
        true,
      ),
      seededProduct(
        "Cozy Blanket Hoodie",
        "Stay warm and comfortable anywhere.",
        3999,
        #fashion,
        4.7,
        #new,
        "https://example.com/blanket-hoodie.jpg",
        90,
        true,
      ),
      seededProduct(
        "Automatic Pet Feeder",
        "Feed your pets on schedule with this smart device.",
        7999,
        #petGear,
        4.5,
        #viral,
        "https://example.com/pet-feeder.jpg",
        60,
        true,
      ),
      seededProduct(
        "LED Makeup Mirror",
        "Perfect your makeup with adjustable lighting.",
        2999,
        #fashion,
        4.6,
        #sale,
        "https://example.com/makeup-mirror.jpg",
        110,
        true,
      ),
      seededProduct(
        "Foldable Laptop Stand",
        "Improve your posture with this ergonomic accessory.",
        1999,
        #techGadgets,
        4.4,
        #hot,
        "https://example.com/laptop-stand.jpg",
        130,
        true,
      ),
      seededProduct(
        "Reusable Grocery Bags",
        "Eco-friendly and durable shopping bags.",
        999,
        #homeEssentials,
        4.8,
        #new,
        "https://example.com/grocery-bags.jpg",
        250,
        true,
      ),
      seededProduct(
        "Dog Water Bottle",
        "Convenient hydration for pets on the go.",
        1999,
        #petGear,
        4.7,
        #viral,
        "https://example.com/dog-bottle.jpg",
        140,
        true,
      ),
    ]);

    for (product in trendingProducts.values()) {
      products.add(product.id, product);
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product CRUD Operations
  public shared ({ caller }) func createProduct(product : Product) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let newProduct : Product = {
      product with
      id = nextProductId;
    };

    products.add(nextProductId, newProduct);
    nextProductId += 1;
    newProduct;
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.remove(id);
      };
    };
  };

  public type SortOption = {
    #trending;
    #priceAsc;
    #priceDesc;
    #rating;
  };

  public query ({ caller }) func getProducts(category : ?ProductCategory, sort : ?SortOption) : async [Product] {
    let filteredProducts = products.values().toArray().filter(
      func(p) {
        switch (category) {
          case (null) { true };
          case (?cat) { p.category == cat };
        };
      }
    );

    let sortedProducts = switch (sort) {
      case (?sortOpt) {
        switch (sortOpt) {
          case (#trending) {
            filteredProducts.sort(
              func(a, b) {
                switch (Nat.compare(b.inStock, a.inStock)) {
                  case (#equal) { Nat.compare(b.reviewCount, a.reviewCount) };
                  case (order) { order };
                };
              }
            );
          };
          case (#priceAsc) {
            filteredProducts.sort(
              func(a, b) { Nat.compare(a.price, b.price) }
            );
          };
          case (#priceDesc) {
            filteredProducts.sort(
              func(a, b) { Nat.compare(b.price, a.price) }
            );
          };
          case (#rating) {
            filteredProducts.sort(
              func(a, b) {
                let ratingA = a.rating * 10000;
                let ratingB = b.rating * 10000;
                Int.compare(ratingB.toInt(), ratingA.toInt());
              }
            );
          };
        };
      };
      case (null) { filteredProducts };
    };

    sortedProducts;
  };

  // Shopping Cart Operations
  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.items.values().toArray().sort() };
    };
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let existingCart = switch (carts.get(caller)) {
          case (null) { { user = caller; items = Map.empty<Nat, CartItem>() } };
          case (?cart) { cart };
        };

        let updatedItem = switch (existingCart.items.get(productId)) {
          case (null) { { productId; quantity } };
          case (?cartItem) { { productId; quantity = cartItem.quantity + quantity } };
        };

        existingCart.items.add(productId, updatedItem);
        carts.add(caller, existingCart);
      };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        cart.items.remove(productId);
        carts.add(caller, cart);
      };
    };
  };

  public shared ({ caller }) func updateCartItemQuantity(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        switch (cart.items.get(productId)) {
          case (null) { Runtime.trap("Product not in cart") };
          case (?_) {
            let updatedItem = { productId; quantity };
            cart.items.add(productId, updatedItem);
            carts.add(caller, cart);
          };
        };
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    carts.remove(caller);
  };

  // Flash Sale Operations
  public query ({ caller }) func getFlashSale() : async ?FlashSale {
    switch (activeFlashSale) {
      case (?sale) {
        if (Time.now() > sale.endTime) {
          null;
        } else {
          activeFlashSale;
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func createFlashSale(productIds : [Nat], discountPercent : Nat, durationMinutes : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create flash sales");
    };
    let endTime = Time.now() + (durationMinutes * 60_000_000_000);
    activeFlashSale := ?{
      productIds;
      discountPercent;
      endTime;
    };
  };
};
