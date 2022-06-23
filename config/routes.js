const express = require("express");
const multer = require("multer"); // for file upload
const controllers = require("../app/controllers");
const path = require("path"); // import path

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // set destination
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); // set filename
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false)
  }
}

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
apiRouter.post("/api/v1/users/login", controllers.api.v1.userController.login);
apiRouter.put("/api/v1/users/:id", multer({
  storage: diskStorage,
  fileFilter: fileFilter
}).single("profile_img"), controllers.api.v1.userController.updateProfile);

//PRODUCT
apiRouter.post("/api/v1/products",
  multer({
    storage: diskStorage,
    fileFilter: fileFilter
  }).single("product_img1"),
  controllers.api.v1.productController.createProduct);
apiRouter.delete("/api/v1/products/:id",
  controllers.api.v1.productController.deleteProductById
);
apiRouter.put("/api/v1/products/:id",
  multer({
    storage: diskStorage,
    fileFilter: fileFilter
  }).single("product_img1"),
  controllers.api.v1.productController.updateProductById
);
apiRouter.get("/api/v1/products", controllers.api.v1.productController.listAllProduct);

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