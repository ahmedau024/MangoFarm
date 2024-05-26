//@ts-nocheck
import mongoose from "mongoose";

interface OWNER {
  username: string;
  email: string;
  password: string;
  address: string;
  tel: number;
  regions: string[];
  employees: string[];
  salt: string;
  profitData?: string[];
}

let ownerSchema = new mongoose.Schema<OWNER>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  tel: {
    type: Number,
    required: false,
  },
  regions: {
    type: [String],
    default: [],
  },
  employees: {
    type: [String],
    default: [],
  },
  salt: {
    type: String,
    required: true,
  },
  profitData: {
    type: [String],
    validate: (v) => v.length === 12,
    default: () => Array.from({ length: 12 }, () => 0),
  },
});

const Owner = mongoose.model<OWNER>("owner", ownerSchema);

export default Owner;
