import { db } from '@/service/firebase.Config';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';

const Viewtrip = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tripId) GetTripData();
    }, [tripId]);

    // Fetch trip data from Firebase
    const GetTripData = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'NomadlyAI', tripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setTrip(docSnap.data());
            } else {
                console.log("No Such Document");
                toast.error("No trip found");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            toast.error("Failed to fetch trip data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 md:px-20 lg:px-32 xl:px-48">
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FFD700]"></div>
                </div>
            ) : trip ? (
                <>
                    {/* Info Section */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border border-[#FFD700]">
                        <InfoSection trip={trip} />
                    </div>

                    {/* Hotels Section */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border border-[#FFD700]">
                        <h2 className="text-2xl font-bold text-[#FFD700] mb-4">🏨 Recommended Hotels</h2>
                        <Hotels trip={trip} />
                    </div>

                    {/* Daily Plan / Itinerary */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border border-[#FFD700]">
                        <h2 className="text-2xl font-bold text-[#FFD700] mb-4">🗺️ Daily Plan</h2>
                        <PlacesToVisit trip={trip} />
                    </div>
                </>
            ) : (
                <div className="text-center text-gray-400">
                    <p>⚠️ No trip data available.</p>
                </div>
            )}
        </div>
    );
};

export default Viewtrip;
