// components/RecentMaterials.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFaveriteLinks } from '../utils/recentMaterials';

const FaveriteLinks = () => {
  const [recentMaterials, setRecentMaterials] = useState([]);

  useEffect(() => {
    setRecentMaterials(getFaveriteLinks());
  }, []);

  return (
    <div className="recent-materials">
      <h3>الروابط المفضلة</h3>
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

export default FaveriteLinks;
