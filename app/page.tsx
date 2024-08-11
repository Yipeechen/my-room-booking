'use client';

import RoomAllocation from '../components/RoomAllocation'

export default function Home() {
  return (
    <main>
      <div className='text-left max-w-md mx-auto'>
        <div className='text-lg my-4'>{`住客人數：${guest.adult} 位大人，${guest.child} 位小孩 / ${rooms.length} 房`}</div>
        <RoomAllocation
          guest={guest}
          rooms={rooms}
          onChange={result => console.log(result)}
        />
      </div>
    </main>
  );
}
