import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  floor: Number,
  roomNumber: Number,
  acreage: Number,
  purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "peoples",
  },
  status: String,
});

const DepartmentModel = mongoose.model("departments", DepartmentSchema);

export default DepartmentModel;
