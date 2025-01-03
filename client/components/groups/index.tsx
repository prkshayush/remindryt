'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchGroups } from '@/lib/store/features/groupSlice';
import GroupList from './GroupList';


const Groups = () => {
  const dispatch = useAppDispatch();
  const { groups = [], loading, error } = useAppSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  if (loading) {
    return <div className="p-4">Loading groups...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Groups List */}
      <div className="col-span-12 md:col-span-8 lg:col-span-9">
        <h2 className="text-xl font-bold mb-4">My Groups</h2>
        <GroupList groups={groups} />
      </div>
    </div>
  );
};

export default Groups;