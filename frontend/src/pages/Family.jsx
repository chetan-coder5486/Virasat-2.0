import { useAuth } from '@/context/AuthContext';
import React, { use, useEffect, useState } from 'react'

const Family = () => {
  const [family, setFamily] = useState(null)
  const {api} = useAuth();
  useEffect(() => {
    //fetch family details and members
    const fetchFamilyDetails = async () => {
      try {
        const response = await api.get('/family/');
        setFamily(response.data.family);
      } catch (error) {
        console.error("Error fetching family details:", error);
      }
    };

    fetchFamilyDetails();
  }, []);

  return (
    <div>
      {family ? (
        <div>
          <h2>Family Details</h2>
          <p>Name: {family.name}</p>
          <p>Description: {family.description}</p>
          {/* Display family members */}
        </div>
      ) : (
        <p>Create Family</p>
      )}
    </div>
  )
}

export default Family
