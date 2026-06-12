import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path if necessary
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Adjust the import path if necessary

const GoogleSignIn = ({ open, setOpen, setUser }) => {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      setLoading(true);
      try {
        // Fetch user profile details from Google API
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
          {
            headers: { Authorization: `Bearer ${tokenInfo.access_token}` },
          }
        );

        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
        setOpen(false); // Close the dialog
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      setLoading(false);
    },
    ux_mode: "popup",
    scope: "email profile openid",
    prompt: "consent",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-amber-100 shadow-lg rounded-lg">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="font-bold text-lg">Sign In With Google</DialogTitle>
          <DialogDescription>
            <div className="text-center text-sm text-gray-600">
              Sign in to the App with Google Authentication securely.
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-1">
          <Button
            onClick={login}
            className="w-full flex gap-4 items-center"
            variant="default"
            disabled={loading}
          >
            <FcGoogle className="h-7 w-7" />
            {loading ? "Signing In..." : "Sign In With Google"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleSignIn;