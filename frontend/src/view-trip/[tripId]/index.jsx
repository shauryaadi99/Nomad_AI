import firebaseConfig from "../../service/firebase.config";
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import { db } from '@/service/firebase.config';
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Viewtrip = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tripId) GetTripData();
    }, [tripId]);

    const GetTripData = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'NomadlyAI', tripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTrip(docSnap.data());
            } else {
                toast.error("No trip found");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            toast.error("Failed to fetch trip data");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 pt-24 pb-12 px-5 md:px-20 lg:px-32 xl:px-40 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
                        <AiOutlineLoading3Quarters className="h-12 w-12 animate-spin text-indigo-500" />
                        <p className="text-slate-400 font-medium">Loading your journey...</p>
                    </div>
                ) : trip ? (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-12"
                    >
                        {/* Info Section */}
                        <motion.div variants={itemVariants}>
                            <InfoSection trip={trip} />
                        </motion.div>

                        {/* Hotels Section */}
                        <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                Recommended Hotels
                            </h2>
                            <Hotels trip={trip} />
                        </motion.div>

                        {/* Daily Plan / Itinerary */}
                        <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                Your Daily Itinerary
                            </h2>
                            <PlacesToVisit trip={trip} />
                        </motion.div>
                    </motion.div>
                ) : (
                    <div className="text-center text-slate-500 min-h-[60vh] flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4">🏜️</div>
                        <p className="text-xl font-medium text-slate-400">No trip data found.</p>
                        <p className="mt-2 text-sm">Create a new journey to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Viewtrip;
