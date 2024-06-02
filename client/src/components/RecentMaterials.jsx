// components/RecentMaterials.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentMaterials } from '../utils/recentMaterials';

const RecentMaterials = () => {
  const [recentMaterials, setRecentMaterials] = useState([]);

  useEffect(() => {
    setRecentMaterials(getRecentMaterials());
  }, []);

  return (
    <div className="recent-materials">
      <h3>الروابط المزارة أخيرا:</h3>
      <ul>
        {recentMaterials.map((material) => (
          <li key={material.id}>
            <Link to={`${material.path}`}>{material.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentMaterials;
