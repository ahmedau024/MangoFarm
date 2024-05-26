import { Request, Response, NextFunction } from "express";
import Owner from "../models/owner";
import Employee from "../models/employee";
import { genSalt, hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

interface RegisterBody {
  username: string;
  password: string;
  //   isOwner: boolean;
  email: string;
}
interface LoginBody {
  email: string;
  password: string;
  //   isOwner: boolean;
}

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { username, email, password }: RegisterBody = req.body;
    // if (isOwner) {
    const existing = await Owner.findOne({ email });
    if (existing) {
      res.status(400).json({
        success: false,
        msg: "User of the given email already exists",
      });
    } else {
      try {
        // hash the entered password
        const salt = await genSalt(10);
        password = await hash(password, salt);
        console.log(password);
        // create user with hashed password
        const owner = await Owner.create({ username, email, password, salt });
        //create jwt
        const token = jwt.sign(
          { userID: owner._id, username, email },
          process.env.JWT_SECRET as string,
          { expiresIn: "7d" }
        );
        if (owner?._id) {
          //return jwt
          res.status(200).json({
            success: true,
            token,
            data: {
              id: owner._id,
              email: owner.email,
              username: owner.username,
            },
          });
        } else {
          res.status(400).json({ msg: "couldn't create" });
        }
      } catch (err) {
        next(err);
      }
    }
    // } else {
    //   const employee = await Employee.create({ username, email, password });
    //   if (employee?._id) {
    //     res.status(201).json({success: true, data: employee});
    //   }
    //   else {
    //     res.status(400).json({msg:"couldn't create"})
    //   }
    // }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email, password }: LoginBody = req.body;
    console.log(req.body);
    // if (isOwner) {
    const existing = await Owner.findOne({ email });
    console.log(existing);
    if (existing?._id) {
      try {
        // hash entered password
        password = await hash(password, existing.salt);
        // commpare entered password with the one in DB
        // console.log(password, existing.password);
        //  const valid: Boolean = await compare(password, existing.password)
        if (password === existing.password) {
          const token = await jwt.sign(
            { userID: existing._id, username: existing.username, email },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
          );

          res.status(200).json({
            success: true,
            token,
            data: {
              id: existing._id,
              email: existing.email,
              username: existing.username,
            },
          });
        } else {
          res.status(400).json({ msg: "wrong password", success: false });
        }
      } catch (err) {
        next(err);
      }
    } else {
      res.status(404).json({ msg: "no such user" });
    }
    // } else {
    //   const existing = await Employee.create({ username, password });
    //   if (existing?._id) {
    //     res.status(200).json({success: true, data: existing});
    //   }
    //   else{
    //     res.status(404).json({msg: "no such user"})
    //   }
    // }
  } catch (err) {
    console.log(err);
  }
};

export { register, login };
