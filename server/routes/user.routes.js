const Router = require("express");
const router = new Router();
const userController = require("../controller/user.controller");
const isAuthenticated = require("../middleware/middleware");

router.post("/createUser", userController.createUser);
router.get("/getUsers", isAuthenticated, userController.getUsers);
router.get("/getUserByEmail", userController.getUserByEmail);
router.get("/user/:id", isAuthenticated, userController.getOneUser);
router.put("/updateUser", isAuthenticated, userController.updateUser);

router.get("/getFurniture/:id", userController.getFurnitureById);
router.get("/getFurniture", userController.getFurniture);
router.get("/getFurnitureByType", userController.getFurnitureByType);
router.get("/getFurnitureByString", userController.getFurnitureByString);

router.get("/getSlider", userController.getSlider);
router.get("/getServices", userController.getServices);

// router.post("/addCart", userController.addCart);
router.get("/getCart", isAuthenticated, userController.getCart);
router.post("/addCart", isAuthenticated, userController.addCart);
router.patch("/updateCartPlus", isAuthenticated, userController.updateCartPlus);
router.patch(
  "/updateCartMinus",
  isAuthenticated,
  userController.updateCartMinus
);
router.patch("/checkCart", isAuthenticated, userController.checkCart);
router.delete("/deleteCart/:id", isAuthenticated, userController.deleteCart);

router.post("/addOrder", isAuthenticated, userController.addOrder);

router.get("/getFavorite", isAuthenticated, userController.getFavorite);
router.post("/addFavorite", isAuthenticated, userController.addFavorite);
router.delete(
  "/deleteFavorite/:id",
  isAuthenticated,
  userController.deleteFavorite
);
router.get("/getDeliveryCur", isAuthenticated, userController.getDeliveryCur);
router.get(
  "/getDeliveryFinish",
  isAuthenticated,
  userController.getDeliveryFinish
);

router.get("/furnitureSliderBest", userController.furnitureSliderBest);
router.get("/furnitureSliderInterCh", userController.furnitureSliderInterCh);
router.get("/furnitureSliderInterKit", userController.furnitureSliderInterKit);
router.get("/furnitureSliderInterLiv", userController.furnitureSliderInterLiv);
router.get("/furnitureSliderInterBed", userController.furnitureSliderInterBed);

router.get("/getTypes", userController.getTypes);

module.exports = router;
