import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs';

import CardsGroup from '../SpecialComponents/CardsGroup';
import { AddCollage } from './AddCollage';
export default function Collages() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.collagesManagement);




  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <p className="title-message">Oh no!</p>
          <p className="subtitle-message">Something went wrong</p>
        </div>
      </div>
    );
  }
  
  
  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">Taskbox</h1>
      </nav>
      <CardsGroup collection={'collages'} editModel={AddCollage}  />
    </div>
  );
}