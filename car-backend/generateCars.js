import fs from "fs";

const brands = [
  "Toyota", "Honda", "BMW", "Audi", "Mercedes",
  "Volkswagen", "Tesla", "Ford", "Hyundai", "Kia"
];

const categories = ["SUV", "Sedan", "Sport", "Luxury", "Electric", "Truck"];

const models = [
  "Alpha", "Prime", "Max", "Eco", "X", "Pro", "GT", "Neo", "Ultra", "Sport"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice(category) {
  if (category === "Luxury") return 300 + Math.floor(Math.random() * 200);
  if (category === "Electric") return 200 + Math.floor(Math.random() * 150);
  if (category === "SUV") return 150 + Math.floor(Math.random() * 150);
  return 80 + Math.floor(Math.random() * 120);
}

function randomYear() {
  return 2018 + Math.floor(Math.random() * 7);
}

// 🟢 NUMBER OF CARS
const TOTAL = 100;

let csv = "name,brand,category,pricePerDay,year,description\n";

for (let i = 1; i <= TOTAL; i++) {
  const brand = random(brands);
  const model = random(models);
  const category = random(categories);

  const name = `${model} ${i}`;
  const price = randomPrice(category);
  const year = randomYear();

  const desc = `${brand} ${category} car - generated model`;

  csv += `${name},${brand},${category},${price},${year},${desc}\n`;
}

fs.writeFileSync("cars_100_generated.csv", csv);

console.log("🚗 100 Cars CSV generated successfully!");