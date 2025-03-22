import LocationSearch from "@/components/custom/Autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelsList,
} from "@/constants/options";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/service/firebase.config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTripsPage = () => {
  const [formData, setFormData] = useState({});
  const [openDialog, setopenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocationSelect = (selectedLocation) => {
    setFormData((prevData) => ({
      ...prevData,
      location: selectedLocation,
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setopenDialog(false);
      })
      .catch((error) => console.error("Error fetching profile:", error));
  };

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => {
      console.log("Token received:", tokenInfo);
      setopenDialog(false);
      GetUserProfile(tokenInfo);
    },
    onError: (error) => console.log("Login error:", error),
    ux_mode: "popup",
    scope: "email profile openid",
    prompt: "consent",
  });
  const OnGenerateTrips = async () => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
  
    if (!user || !user.email) {
      toast.custom(() => <div className="text-[#FFD700] font-semibold">⚠️ Please sign in first!</div>);
      return;
    }
  

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location)
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.Travelers)
      .replace("{budget}", formData.budget);

    console.log(FINAL_PROMPT);
    setLoading(true);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(result.response.text());
      await SaveAITrip(result.response.text());
    } catch (error) {
      console.error("Error generating trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const SaveAITrip = async (TripData) => {
    setLoading(true);
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!user || !user.email) {
      console.error("User not found or email missing.");
      setLoading(false);
      return;
    }

    const docId = Date.now().toString();
    const removeUndefinedFields = (obj) => JSON.parse(JSON.stringify(obj));
    const parsedTripData = typeof TripData === "string" ? JSON.parse(TripData) : TripData;
    const cleanedTripData = removeUndefinedFields(parsedTripData);

    console.log("Saving Trip:", {
      userSelection: formData,
      tripData: parsedTripData,
      userEmail: user.email,
      id: docId,
    });

    try {
      await setDoc(doc(db, "NomadlyAI", docId), {
        userSelection: formData,
        tripData: cleanedTripData,
        userEmail: user.email,
        id: docId,
      });
      console.log("Trip saved successfully");
    } catch (error) {
      console.error("Error saving trip:", error);
    }

    setLoading(false);
    navigate(`/view-trip/${docId}`);
  };



return (
  <div className="w-full min-h-screen bg-gray-900 text-white px-5 md:px-20 lg:px-32 xl:px-40 py-16">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-[#FFD700] text-center">
        Tell us your travel preferences 🏕️🌴
      </h2>
      <p className="mt-3 text-gray-400 text-lg text-center">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-16 flex flex-col gap-12">
        {/* Destination & Days */}
        <div>
          <h2 className="text-xl text-[#FFD700] my-3 font-medium">
            What is your destination of choice?
          </h2>
          <LocationSearch onSelect={handleLocationSelect} />

          <h2 className="text-xl text-[#FFD700] my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            className="bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2"
            placeholder="Ex. 3"
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
            onWheel={(e) => e.target.blur()} // Prevents scroll-based value changes
            />
        </div>

        {/* Budget Selection */}
        <div>
          <h2 className="text-xl text-[#FFD700] my-3 font-medium">
            What is Your Budget?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item) => (
              <div
              key={item.id}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border border-gray-700 bg-gray-900 text-white rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl shadow-md
                  ${
                    formData?.budget === item.title
                    ? "border-amber-600 shadow-amber-500"
                    : ""
                  }
                  `}
                  >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg mt-2">{item.title}</h2>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Travelers Selection */}
        <div>
          <h2 className="text-xl text-[#FFD700] my-3 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectTravelsList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange("Travelers", item.people)}
                className={`p-4 border border-gray-700 bg-gray-900 text-white rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl shadow-md
                  ${
                    formData?.Travelers === item.people
                    ? "border-amber-600 shadow-amber-500"
                    : ""
                  }
                  `}
                  >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg mt-2">{item.title}</h2>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="my-12 flex justify-center">
        <Button
          onClick={OnGenerateTrips}
          disabled={loading}
          className="bg-[#FFD700] text-black px-8 py-3 text-lg font-semibold rounded-lg hover:bg-amber-600 transition-all"
          >
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate Trip"
          )}
        </Button>
      </div>
    </div>

    {/* Google Sign-In Modal */}
    <Dialog open={openDialog} onOpenChange={setopenDialog}>
      <DialogContent className="bg-gray-900 border border-amber-600 shadow-xl rounded-lg p-8">
        <DialogHeader>
          <DialogDescription className="flex flex-col items-center text-white">
            <h2 className="font-bold text-lg text-[#FFD700]">Sign In With Google</h2>
            <p className="text-gray-400">Sign in to the App with Google Authentication securely</p>
            <Button
              onClick={login}
              className="w-full mt-5 flex gap-4 items-center bg-[#FFD700] text-black px-6 py-3 rounded-lg hover:bg-amber-600 transition-all"
              >
              <FcGoogle className="h-7 w-7" />
              Sign In With Google
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </div>
);
}
export default CreateTripsPage;
