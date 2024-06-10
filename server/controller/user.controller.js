const { response } = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

class UserController {
  async getUserByEmail(req, res) {
    try {
      console.log(req.query.email);
      const { email, password } = req.query;

      console.log(email);
      const response = await db.query(
        `select * from users, cart 
          where users.user_id = cart.user_id and email = '${email}'`
      );
      const user = response.rows[0];

      if (!user) {
        res.status(404).json({ status: 404, message: "User not found" });
      } else {
        // const rounds = 1;
        // bcrypt.hash("1", rounds, (err, hash) => {
        //   if (err) {
        //     console.error(err);
        //     return;
        //   }
        //   console.log(hash);
        // });
        bcrypt.compare(password, user.password, function (err, result) {
          console.log(result);
          if (result === true) {
            req.session.userId = user.user_id;
            req.session.cartId = user.cart_id;
            res.status(200).send("Login successful");
          } else {
            res.status(401).json({ status: 401, message: "Invalid password" });
          }
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  async createUser(req, res) {
    // const newUser = await db.query(` insert into users(${}, ${}, ${}, ${}, ${}, ${}) returning *`);
    // res.json(newUser);
  }

  async getUsers(req, res) {
    const users = await db.query(`select * from users`);
    res.status(200).send(users.rows);
  }

  async getOneUser(req, res) {}
  async updateUser(req, res) {}

  async getFurniture(req, res) {
    // console.log("------");
    // console.log(req.query);
    try {
      const response = await db.query(
        `select furniture.furniture_id as href, path, furn_name as name, price, new_price, furn_type_name as type, char_value 
          from furniture, images, character_pool, character_value, characteristic, furniture_type 
          where furniture.furniture_id = images.furniture_id and 
          furniture.furn_type_id = furniture_type.furn_type_id and
          furniture.furniture_id = character_pool.furniture_id and
          character_pool.character_value_id = character_value.character_value_id and
          character_value.character_id = characteristic.character_id and
          characteristic.character_id = 4 and
          images.important = true`
      );
      console.log(response.rows);
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
  async getFurnitureById(req, res) {
    // console.log("------");
    // try {
    //   const response = await db.query(
    //     `select distinct path, furn_name as name, price, new_price, character_name, char_value value
    //       from furniture, images, character_pool, character_value, characteristic
    //       where furniture.furniture_id = images.furniture_id and
    //       furniture.furniture_id = character_pool.furniture_id and
    //       character_pool.character_value_id = character_value.character_value_id and
    //       character_value.character_id = characteristic.character_id and
    //   character_pool.furniture_id = 3`
    //   );
    //   console.log(response.rows);
    //   const furns = response.rows;
    //   if (!furns) {
    //     res.status(404).json({ status: 404, message: "Furniture not found" });
    //   } else {
    //     res.status(200).send(furns);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   res.status(500).send(err.message);
    // }
  }
  async getFurnitureByType(req, res) {}
  async getFurnitureByString(req, res) {}
  async getSlider(req, res) {}
  async getServices(req, res) {}

  async getCart(req, res) {
    console.log("tttttttttttt");
    console.log(req.session.cartId);
    try {
      const response = await db.query(
        `select furniture.furniture_id as href, path, furn_name as name, price, new_price, char_value, quantity, selected
          from furniture, images, character_pool, character_value, characteristic, cart, cart_pool
          where furniture.furniture_id = images.furniture_id and
          furniture.furniture_id = character_pool.furniture_id and
          character_pool.character_value_id = character_value.character_value_id and
          character_value.character_id = characteristic.character_id and
          furniture.furniture_id = cart_pool.furniture_id and
          cart_pool.cart_id = cart.cart_id and
          characteristic.character_id = 4 and
          images.important = true and cart.user_id =${req.session.cartId}`
      );
      console.log(response.rows);
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  async addCart(req, res) {
    console.log("------ynegr");
    console.log(req.body.id);
    console.log(req.session.cartId);
    // res.status(200).send("123133132312");
    try {
      const response = await db.query(
        `insert into cart_pool(cart_id, furniture_id) values
          (${req.session.cartId}, ${req.body.id});`
      );
      console.log(response.rows);
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  async updateCartPlus(req, res) {
    console.log("plusik");
    console.log(req.body.id);
    try {
      const response = await db.query(
        `UPDATE cart_pool SET quantity = quantity + 1 where cart_id = ${req.session.cartId} and furniture_id = ${req.body.id}`
      );
      // console.log(response.rows);
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
  async updateCartMinus(req, res) {
    console.log("minusik");
    try {
      const response = await db.query(
        `UPDATE cart_pool SET quantity = quantity - 1 where cart_id = ${req.session.cartId} and furniture_id = ${req.body.id}`
      );
      // console.log(response.rows);
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  async checkCart(req, res) {
    console.log("check mem");
    console.log(req.body);
    try {
      const response = await db.query(
        `UPDATE cart_pool SET selected = ${req.body.status} where cart_id = ${req.session.cartId} and furniture_id = ${req.body.id}`
      );
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  async deleteCart(req, res) {
    console.log("delete mem");
    try {
      const response = await db.query(
        `delete from cart_pool where cart_id = ${req.session.cartId} and furniture_id = ${req.params.id}`
      );
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  async addOrder(req, res) {}
  async getFavorite(req, res) {
    console.log("qqqqq");
    // console.log(req);
    try {
      const response = await db.query(
        `select distinct furniture.furniture_id as href, path, furn_name as name, price, new_price, char_value
          from furniture, images, character_pool, character_value, characteristic, favorites
          where furniture.furniture_id = favorites.furniture_id and
		  furniture.furniture_id = images.furniture_id and
          furniture.furniture_id = character_pool.furniture_id and
          character_pool.character_value_id = character_value.character_value_id and
          character_value.character_id = characteristic.character_id and
          characteristic.character_id = 4 and
          images.important = true and favorites.user_id =${req.session.cartId}`
      );
      console.log(response.rows);
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
  async addFavorite(req, res) {
    console.log("add fav");
    // console.log(req.query);
    try {
      const response = await db.query(
        `insert into favorites(user_id, furniture_id) values
          (${req.session.userId}, ${req.body.id});`
      );
      console.log(response.rows);
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
  async deleteFavorite(req, res) {
    console.log("delete fav");
    console.log(req.params.id);
    try {
      const response = await db.query(
        `delete from favorites where user_id = ${req.session.userId} and furniture_id = ${req.params.id}`
      );
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  async getDeliveryCur(req, res) {
    console.log("деливери кур");
    console.log(req.session.cartId);
    try {
      const response = await db.query(
        `select distinct furniture.furniture_id as href, path, furn_name as name, price, new_price, char_value, date_finish
          from furniture, images, character_pool, character_value, characteristic, orders, order_pool
          where furniture.furniture_id = images.furniture_id and
		      furniture.furniture_id = order_pool.furniture_id and
          furniture.furniture_id = character_pool.furniture_id and
          character_pool.character_value_id = character_value.character_value_id and
          character_value.character_id = characteristic.character_id and
		      orders.order_id = order_pool.order_id and
          characteristic.character_id = 4 and
          images.important = true and orders.user_id = ${req.session.cartId}
		      and status = 'on the way'`
      );
      console.log(response.rows);
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  async getDeliveryFinish(req, res) {
    console.log("деливери fin");
    console.log(req.session.cartId);
    try {
      const response = await db.query(
        `select distinct furniture.furniture_id as href, path, furn_name as name, price, new_price, char_value, date_finish
          from furniture, images, character_pool, character_value, characteristic, orders, order_pool
          where furniture.furniture_id = images.furniture_id and
		      furniture.furniture_id = order_pool.furniture_id and
          furniture.furniture_id = character_pool.furniture_id and
          character_pool.character_value_id = character_value.character_value_id and
          character_value.character_id = characteristic.character_id and
		      orders.order_id = order_pool.order_id and
          characteristic.character_id = 4 and
          images.important = true and orders.user_id = ${req.session.cartId}
		      and status = 'finished'`
      );
      console.log(response.rows);
      const furns = response.rows;
      if (!furns) {
        res.status(404).json({ status: 404, message: "Furniture not found" });
      } else {
        res.status(200).send(furns);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }

  async furnitureSliderBest(req, res) {}
  async furnitureSliderInterCh(req, res) {}
  async furnitureSliderInterKit(req, res) {}
  async furnitureSliderInterLiv(req, res) {}
  async furnitureSliderInterBed(req, res) {}
  async getTypes(req, res) {}
}
// console.log(
//   JSON.stringify(req.session.userId) +
//     "==============================================="
// );

module.exports = new UserController();
