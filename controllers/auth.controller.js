import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Http2ServerResponse } from "http2";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "45s" });
};

export const register = async (req, res, next) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password || !profileImageUrl) {
    const err = new Error(
      "Missing parameters, please provide all required fields!"
    );
    err.statusCode = 400;
    err.success = false;
    return next(err);
  }

  try {
    const userCandidate = await User.findOne({ email });
    if (userCandidate) {
      const err = new Error(
        `${email} is already used by another user, please try with another one `
      );
      err.statusCode = 403;
      err.success = false;
      return next(err);
    }

    const userValidated = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });
    if (!userValidated) {
      const err = new Error(
        "An error occurs when registering the new User, please try again"
      );
      err.statusCode = 400;
      err.success = false;
      return next();
    }

    const { password: pwd, ...user } = userValidated._doc;
    user.token = generateToken(user._id);
    return res.status(201).json({
      success: true,
      message: "User registered successfully ! ",
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error(
      "Missing parameters, please provide all required fields"
    );
    err.statusCode = 400;
    err.success = false;
    return next(err);
  }

  try {
    const userCandidate = await User.findOne({ email });
    if (!userCandidate) {
      const err = new Error("No user has registered with this email");
      err.statusCode = 403;
      err.success = false;
      return next(err);
    }

    const isPasswordMatched = userCandidate.comparePassword(password);
    // const isPasswordMatched = bcrypt.compare(password,userCandidate.passw)
    if (!isPasswordMatched) {
      const err = new error("User credentials not valid, please try again !");
      err.statusCode = 403;
      err.success = false;
      return next(err);
    }

    const token = generateToken(userCandidate._id);
    const { password: pwd, ...user } = userCandidate._doc;

    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      magAge: 60 * 60 * 1000,
    });

    user.token = token;

    return res.status(200).json({
      success: true,
      message: "User successfully logged !",
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUserInfos = async (req, res, next) => {
  try {
    const userLogged = await User.findById(req.user_id);
    if (!userLogged) {
      const err = new Error(
        "Not authorized action, please log in and tray again"
      );
      err.statusCode = 403;
      err.success = false;
    }

    const { password, ...user } = userLogged._doc;
    const token = generateToken(userLogged._id);

    return res.status(200).json({
      success: true,
      message: "User data found !",
      data: { user },
    });
  } catch (err) {
    return next(err);
  }
};
