const express = require("express");
const controllers = require("../app/controllers");
// const upload = require("../app/middleware/multer");
// const multer = require("multer");
// const storage = require("../services/multer.service");
// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/jpeg" ||
//       file.mimetype === "image/svg"
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error("File type not available"), false);
//     }
//   },
// });

const upload = require("../utils/upload");
const uploadOnMemory = require("../utils/memoryUpload");
const multer = require("../app/middleware/multer")

const cors = require("cors")

const auth = require("../app/middleware/auth");
const sellerAuth = require("../app/middleware/sellerAuth");
const buyerSeller = require("../app/middleware/buyerSeller");

const appRouter = express.Router();
const apiRouter = express.Router();

apiRouter.use(cors());

/** Mount GET / handler */
appRouter.get("/", controllers.main.index);

/**
 * TODO: Implement your own API
 *       implementations
 */

//USER
apiRouter.post("/api/v1/users/add", controllers.api.v1.userController.createUser);
apiRouter.put("/api/v1/users/profile/edit", auth, multer.single("profile_img"), controllers.api.v1.userController.updateProfile);
apiRouter.post("/api/v1/users/login", controllers.api.v1.userController.login);
apiRouter.get("/api/v1/users", controllers.api.v1.userController.getUsers);
apiRouter.get("/api/v1/users/:id", controllers.api.v1.userController.getUserById);
apiRouter.get("/api/v1/users/profile", auth, controllers.api.v1.userController.infoUser);

//PRODUCT
apiRouter.get("/api/v1/products/info/:id", controllers.api.v1.productController.getInfoProduct);
apiRouter.get("/api/v1/products/:id", controllers.api.v1.productController.getProductbyId);
apiRouter.post("/api/v1/products/filterByCategory", controllers.api.v1.productController.getProductbyCategory);
apiRouter.post("/api/v1/filterByName", controllers.api.v1.productController.getProductbyName);
apiRouter.get("/api/v1/listproduct", controllers.api.v1.productController.listAllProduct);
apiRouter.post("/api/v1/products", sellerAuth, uploadOnMemory.array("img", 4), controllers.api.v1.productController.createProduct);
// apiRouter.get("/api/v1/products/:id", buyerSeller,controllers.api.v1.productController.getProduct);
apiRouter.delete("/api/v1/products/:id", sellerAuth, controllers.api.v1.productController.deleteProductById);
apiRouter.put("/api/v1/products/:id", sellerAuth, uploadOnMemory.array("img", 4), controllers.api.v1.productController.updateProductById);
apiRouter.get("/api/v1/products", controllers.api.v1.productController.listAllProduct);

//TRANSACTION
apiRouter.post("/api/v1/products/offer/:id", auth, controllers.api.v1.transactionController.firstOffer);
apiRouter.get("/api/v1/products/offer/:id/:buyer_id", controllers.api.v1.transactionController.acceptedOffer)
apiRouter.get("/api/v1/products/offer/data/:id", controllers.api.v1.transactionController.getTransaction);

// apiRouter.get("/api/v1/getproductbyname", controllers.api.v1.productController.getProductbyName);

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
