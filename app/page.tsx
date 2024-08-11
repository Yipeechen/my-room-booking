'use client';

import RoomAllocation from '../components/RoomAllocation'

export default function Home() {

  // TODO: CASE 1: fail
  const guest = { adult: 4, child: 2 }
  const rooms = [
    { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
    { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
    { roomPrice: 500, adultPrice: 300, childPrice: 200, capacity: 4 },
  ]

  // CASE 2: success
  // const guest = { adult: 16, child: 0 }
  // const rooms = [
  // { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
  // { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
  // { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
  // { roomPrice: 500, adultPrice: 1000, childPrice: 600, capacity: 2 }
  // ]

  // CASE 3: success
  // const guest = { adult: 0, child: 1 }
  // const rooms = [
  //   { roomPrice: 1000, adultPrice: 500, childPrice: 300, capacity: 2 },
  //   { roomPrice: 500, adultPrice: 400, childPrice: 300, capacity: 4 },
  //   { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
  // ]

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
