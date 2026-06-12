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
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/service/firebase.config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateTripsPage = () => {
  const [formData, setFormData] = useState({});
  const [openDialog, setopenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [loaderMessage, setLoaderMessage] = useState("");

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
        localStorage.setItem("user", JSON.stringify(resp.data));
        setopenDialog(false);
        OnGenerateTrips();
      })
      .catch((error) => console.error("Error fetching profile:", error));
  };

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => {
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
      toast.custom(() => (
        <div className="flex items-center justify-center w-full max-w-xs p-3 glass-card text-indigo-300 font-semibold rounded-md shadow-lg z-50 border-indigo-500/30">
          ⚠️ Please sign in first!
        </div>
      ));
      return;
    }

    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.Travelers) {
      toast.custom(() => (
        <div className="flex items-center justify-center w-full max-w-xs p-3 glass-card text-red-400 font-semibold rounded-md shadow-lg z-50 border-red-500/30">
          ⚠️ All fields must be filled!
        </div>
      ));
      return;
    }

    if (parseInt(formData.noOfDays, 10) > 5) {
      toast.custom(() => (
        <div className="flex items-center justify-center w-full max-w-xs p-3 glass-card text-red-400 font-semibold rounded-md shadow-lg z-50 border-red-500/30">
          ⚠️ You can only plan trips for up to 5 days!
        </div>
      ));
      return;
    }

    setLoaderMessage("Designing Your Perfect Journey...");

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location)
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.Travelers)
      .replace("{budget}", formData.budget);

    setLoading(true);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = typeof result.response.text === 'function' ? result.response.text() : result.response.text;
      await SaveAITrip(responseText);
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
      setLoaderMessage(""); 
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
    let parsedTripData;
    if (typeof TripData === "string") {
      let cleanedText = TripData.trim();
      console.log("RAW AI RESPONSE:", cleanedText);
      
      // Try to extract from ```json ... ``` blocks first
      const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
      const match = cleanedText.match(jsonBlockRegex);
      if (match && match[1]) {
        cleanedText = match[1].trim();
      } else {
        // Fallback: robustly extract the outermost JSON object
        const startIdx = cleanedText.indexOf('{');
        if (startIdx !== -1) {
          let openBraces = 0;
          let endIdx = -1;
          let inString = false;
          let escape = false;

          for (let i = startIdx; i < cleanedText.length; i++) {
            const char = cleanedText[i];
            if (escape) {
              escape = false;
              continue;
            }
            if (char === '\\') {
              escape = true;
              continue;
            }
            if (char === '"') {
              inString = !inString;
              continue;
            }
            if (!inString) {
              if (char === '{') openBraces++;
              else if (char === '}') {
                openBraces--;
                if (openBraces === 0) {
                  endIdx = i;
                  break; // Found the outermost matching closing brace
                }
              }
            }
          }

          if (endIdx !== -1) {
            cleanedText = cleanedText.substring(startIdx, endIdx + 1);
          }
        }
      }
      
      console.log("ATTEMPTING TO PARSE:", cleanedText);
      parsedTripData = JSON.parse(cleanedText);
    } else {
      parsedTripData = TripData;
    }
    const cleanedTripData = removeUndefinedFields(parsedTripData);

    try {
      await setDoc(doc(db, "NomadlyAI", docId), {
        userSelection: formData,
        tripData: cleanedTripData,
        userEmail: user.email,
        id: docId,
      });
    } catch (error) {
      console.error("Error saving trip:", error);
    }

    setLoading(false);
    navigate(`/view-trip/${docId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-50 px-5 md:px-20 lg:px-32 xl:px-40 py-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <motion.div 
        className="max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Tell us your travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">preferences</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Just provide some basic information, and our AI will generate a customized itinerary tailored perfectly for you.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Destination & Days */}
          <motion.div variants={itemVariants} className="glass-card p-8 md:p-10 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">
                What is your destination of choice?
              </h2>
              <div className="relative">
                <LocationSearch onSelect={handleLocationSelect} />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">
                How many days are you planning your trip?
              </h2>
              <Input
                className="bg-slate-900/50 border-slate-700 text-white rounded-xl px-4 py-6 text-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500 transition-all"
                placeholder="Ex. 3"
                type="number"
                onChange={(e) => handleInputChange("noOfDays", e.target.value)}
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </motion.div>

          {/* Budget Selection */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-6 text-slate-200 ml-2">
              What is Your Budget?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SelectBudgetOptions.map((item) => (
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  key={item.id}
                  onClick={() => handleInputChange("budget", item.title)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-sm
                  ${
                    formData?.budget === item.title
                      ? "bg-indigo-900/40 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="text-4xl mb-4 bg-white/10 w-16 h-16 flex items-center justify-center rounded-2xl shadow-inner">{item.icon}</div>
                  <h3 className="font-bold text-xl mb-2 text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Travelers Selection */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-6 text-slate-200 ml-2">
              Who are you traveling with?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {SelectTravelsList.map((item) => (
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  key={item.id}
                  onClick={() => handleInputChange("Travelers", item.people)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-sm
                  ${
                    formData?.Travelers === item.people
                      ? "bg-purple-900/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="text-4xl mb-4 bg-white/10 w-16 h-16 flex items-center justify-center rounded-2xl shadow-inner">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="mt-16 flex justify-center">
          <Button
            onClick={OnGenerateTrips}
            disabled={loading}
            className="group relative px-10 py-8 bg-white text-slate-950 font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(99,102,241,0.4)] disabled:opacity-70 disabled:hover:scale-100"
          >
            <span className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin text-indigo-600" />
                  Generating...
                </>
              ) : (
                "Generate Itinerary"
              )}
            </span>
            {!loading && <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity z-0" />}
          </Button>
        </motion.div>

        {/* Loader Overlay */}
        {loaderMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
          >
            <div className="glass-card p-10 flex flex-col items-center max-w-md text-center border-indigo-500/30">
              <AiOutlineLoading3Quarters className="h-14 w-14 animate-spin text-indigo-400 mb-6" />
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {loaderMessage}
              </h2>
              <p className="text-slate-400 mt-4">Hang tight while our AI curates the perfect experience for you.</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Google Sign-In Modal */}
      <Dialog open={openDialog} onOpenChange={setopenDialog}>
        <DialogContent className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-8 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Sign In</DialogTitle>
            <DialogDescription className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h2 className="font-bold text-2xl text-white mb-3">
                Sign In Required
              </h2>
              <p className="text-slate-400 mb-8">
                Please sign in securely with Google to save and generate your customized itineraries.
              </p>
              <Button
                onClick={login}
                className="w-full flex justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 px-6 py-6 rounded-xl font-semibold shadow-lg transition-all"
              >
                <FcGoogle className="h-6 w-6" />
                Continue with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default CreateTripsPage;
