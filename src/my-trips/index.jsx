import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    // Retrieve user profile from localStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    console.log("Retrieved userProfile from localStorage:", userProfile); // Debugging log

    if (!userProfile || !userProfile.email) {
      console.error("User profile not found or email is missing");
      navigate('/');
      return;
    }

    try {
      // Query Firestore for trips associated with the user's email
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', userProfile.email));
      const querySnapshot = await getDocs(q);
      setUserTrips([]);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setUserTrips((prevVal) => [...prevVal, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching user trips:", error);
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 gap-5'>
      <h2 className='font-bold text-3xl'>My Trips</h2>
      <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
        {userTrips.length > 0 ? (
          userTrips.map((trip, index) => (
            <UserTripCardItem trip={trip} key={index} />
          ))
        ) : (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div key={index} className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'></div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTrips;