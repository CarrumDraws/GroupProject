const db = require("./connection.js");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const Product = require("../models/Product.js");
const Brand = require("../models/Brand.js");

const data = require("./data.json"); // Adjust the path as needed

(async () => {
  try {
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Brand.deleteMany(),
    ]);

    let password = "Abc1@2";
    password = await bcrypt.hash(password, Number(process.env.SALT));

    const user = new User({
      username: "Calum",
      email: "calumchansy@gmail.com",
      password: password,
      admin: true,
    });
    await user.save();

    for (const brandData of data.brands) {
      try {
        // Create brand
        const brand = await Brand.create({ name: brandData.name });

        // Generate array of product ID's
        const products = await Promise.all(
          brandData.products.map(async (productData) => {
            // Add each product, assigning the brand ID + returning the product ID
            const product = await Product.create({
              name: productData.name,
              description: productData.description,
              rating: productData.rating,
              category: productData.category,
              price: productData.price,
              brand: brandData.name, // Assign the brand's ObjectId
              image: productData.image,
            });
            return product._id;
          })
        );

        brand.products = products; // Update brand with product IDs
        await brand.save();

        console.log(
          `Seeded brand '${brand.name}' with ${products.length} products`
        );
      } catch (error) {
        console.error("Error seeding brand:", error);
      }
    }

    console.log("DB initialized");
  } catch (error) {
    console.error(error);
  } finally {
    await db.close();
  }
})();
