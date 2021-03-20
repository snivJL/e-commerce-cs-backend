const faker = require("faker");
const fs = require("fs");

const Product = require("./models/Product");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dilv93gvb",
  api_key: "767733964931634",
  api_secret: "N1PY-jSpvf9hVV2MgxQlD5vrBIs",
});

let generateData = {};

generateData.upload = async (image) => {
  try {
    const { url } = await cloudinary.uploader.upload(
      `images/${image}`,
      function (error, result) {
        return result;
      }
    );
    return { imageUrl: url };
  } catch (error) {
    console.error(error);
  }
};
generateData.uploadCloudinary = async (num) => {
  let images = fs.readdirSync("./images");
  const image = faker.random.arrayElements(images, num);
  let imagesUrl = [];
  for (let i = 0; i < num; i++) {
    imagesUrl.push(await generateData.upload(image[i]));
  }
  return imagesUrl;
};

const generateProduct = async (num, numImages) => {
  for (let i = 0; i < num; i++) {
    const product = await Product.create({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.random.number({ min: 1, max: 3000 }),
      rating: faker.random.number({ min: 0, max: 5 }),
      images: await generateData.uploadCloudinary(numImages),
    });
    console.log(`Product ${i + 1} ${product.name} ${product.rating} created!`);
  }
};
// generateProduct(100 , 3);

// const generateUser = async (num) => {
//   for (let i = 0; i < num; i++) {
//     const user = await User.create({
//       name: faker.name.findName(),
//       email: faker.internet.email(),
//       // you may need to hash this password first
//       password: "123",
//     });
//     console.log(`User ${i + 1} ${user.name} created!`);
//   }
// };

module.exports = generateData;
