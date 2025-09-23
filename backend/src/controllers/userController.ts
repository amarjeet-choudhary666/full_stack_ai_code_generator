import { User } from "../models/userModel";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";


export const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ApiError(401, "All feilds are required")
        }

        const existing = await User.findOne({
            email: email
        });

        if (existing) {
            throw new ApiError(409, "User already exists with this email")
        }

        const user = await User.create({
            email,
            name,
            password
        })

        const createdUser = await User.findById(user._id).select(" -password -refreshToken ")

        if (!createdUser) {
            throw new ApiError(500, "something went wrong while creating user")
        }

        return res.status(201).json(
            new ApiResponse(201, createdUser, "User created successfully")
        )

    } catch (error: any) {
        console.log("Internal server error failed to create user", error)
    }
})


export const loginUser = asyncHandler(async (req, res) => {
  try {
      const { email, password } = req.body;
  
      if (!email || !password) {
          throw new ApiError(401, "All feild are required")
      }
  
      const user = await User.findOne({
          email: email
      });
  
      if (!user) {
          throw new ApiError(404, "user not found with this email")
      }
  
      const isPasswordValid = await user.comparePassword(password);
  
      if (!isPasswordValid) {
          throw new ApiError(401, "Invalid password");
      }
  
      const accessToken = generateAccessToken(String(user._id));
      const refreshToken = generateRefreshToken(String(user._id));
  
      if(!refreshToken || !accessToken){
          throw new ApiError(500, "something went wrong while creating refresh or accesstoken")
      }
  
      return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email
        },
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    )
  );
  } catch (error: any) {
    console.log("Internal server error", error)
  }

})