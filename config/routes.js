const express = require("express");
const controllers = require("../app/controllers");
// const upload = require("../app/middleware/multer");
const multer = require("multer");
const storage = require("../services/multer.service");
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File type not available"), false);
    }
  },
});


const auth = require("../app/middleware/auth");
const sellerAuth = require("../app/middleware/sellerAuth");
const buyerSeller = require("../app/middleware/buyerSeller");

const appRouter = express.Router();
const apiRouter = express.Router();

/** Mount GET / handler */
appRouter.get("/", controllers.main.index);

/**
 * TODO: Implement your own API
 *       implementations
 */
apiRouter.get("/api/v1/posts", controllers.api.v1.post.list);
apiRouter.post("/api/v1/posts", controllers.api.v1.post.create);
apiRouter.put(
  "/api/v1/posts/:id",
  controllers.api.v1.post.setPost,
  controllers.api.v1.post.update
);
apiRouter.get(
  "/api/v1/posts/:id",
  controllers.api.v1.post.setPost,
  controllers.api.v1.post.show
);
apiRouter.delete(
  "/api/v1/posts/:id",
  controllers.api.v1.post.setPost,
  controllers.api.v1.post.destroy
);

//USER
apiRouter.post("/api/v1/users/add", controllers.api.v1.userController.createUser);
apiRouter.put("/api/v1/users/profile/edit", auth, upload.single("profile_img"), controllers.api.v1.userController.updateProfile);
apiRouter.post("/api/v1/users/login", controllers.api.v1.userController.login);
apiRouter.get("/api/v1/users/profile", auth, controllers.api.v1.userController.infoUser);

//PRODUCT
apiRouter.get("/api/v1/products/:id", controllers.api.v1.productController.getProductbyId);
apiRouter.get("/api/v1/listproduct", controllers.api.v1.productController.listAllProduct);
apiRouter.post("/api/v1/products", sellerAuth, upload.single("product_img1"), controllers.api.v1.productController.createProduct);
// apiRouter.get("/api/v1/products/:id", buyerSeller,controllers.api.v1.productController.getProduct);
apiRouter.delete("/api/v1/products/:id",
  controllers.api.v1.productController.deleteProductById
);
apiRouter.put("/api/v1/products/:id", upload.single("product_img1"), controllers.api.v1.productController.updateProductById);
apiRouter.get("/api/v1/products", controllers.api.v1.productController.listAllProduct);
apiRouter.get("/api/v1/getproduct/:id", controllers.api.v1.productController.getProductbyId);
apiRouter.post("/api/v1/products/offer/:id", auth,controllers.api.v1.transactionController.firstOffer);

/**
 * TODO: Delete this, this is just a demonstration of
 *       error handler
 */
apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

/**
 * TODO: Delete this, this is just a demonstration of
 *       error handler
 */
appRouter.get("/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

appRouter.use(apiRouter);

/** Mount Not Found Handler */
appRouter.use(controllers.main.onLost);

/** Mount Exception Handler */
appRouter.use(controllers.main.onError);

module.exports = appRouter;