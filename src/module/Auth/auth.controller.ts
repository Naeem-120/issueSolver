import type { Request, Response } from "express";
import sendResponse from "../../utility/response";
import { authService } from "./auth.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerIntoDB(req.body);
    if (!result) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Failed to register user",
      });
    }
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    if (!result) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Failed to login user",
      });
    }
    const {
      token: { accessToken, refreshToken },
    } = result;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: "lax",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.refreshToken(refreshToken);
    if (!result) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Failed to refresh access token",
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Access token refreshed successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const authController = {
  registerUser,
  loginUser,
  refreshToken,
};
