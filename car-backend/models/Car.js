import mongoose from "mongoose"

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },

    category: {
      type: String,
      enum: ["SUV", "Sedan", "Sport", "Luxury", "Electric", "Truck"],
      required: true
    },

    pricePerDay: { type: Number, required: true },
    year: { type: Number, required: true },

    images: {
      type: [String],
      default: []
    },

    description: { type: String, default: "" },

    available: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export default mongoose.model("Car", carSchema)