import mongoose, { Date } from "mongoose";

interface EMP {
  name: string;
  owner: string;
  email: string;
  hourlyRate: string;
  hourlyWorked: string;
  wages: number;
  timeStamp: string;
  joinDate: string;
  leaveDate?: string;
}
let employeeSchema = new mongoose.Schema<EMP>({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: String,
    required: true,
  },
  hourlyWorked: {
    type: String,
    required: true,
  },
  wages: {
    type: Number,
    required: true,
  },
  timeStamp: {
    type: String,
  },
  joinDate: {
    type: String,
    required: true,
  },
  leaveDate: {
    type: String,
  },
});

const Employee = mongoose.model("employee", employeeSchema);
export default Employee;
