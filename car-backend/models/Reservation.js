import mongoose from "mongoose"

const reservationSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function () {
          return this.endDate > this.startDate
        },
        message: "End date must be after start date"
      }
    },

    totalPrice: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
)
reservationSchema.index({ car: 1, startDate: 1, endDate: 1 })
reservationSchema.index({ user: 1 })
reservationSchema.index({ status: 1 })

export default mongoose.model("Reservation", reservationSchema)