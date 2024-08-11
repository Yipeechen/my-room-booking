
export interface Guest {
  adult: number
  child: number
}

export interface Room {
  roomPrice: number
  adultPrice: number
  childPrice: number
  capacity: number
}

export interface RoomResult extends Guest {
  id: string
  price: number
  capacity: number
}

export const getDefaultRoomAllocation = (guest: Guest, rooms: Room[]): RoomResult[] => {
  const sortedRoomsWithAvg = rooms
    .map((each, index) => ({
      ...each,
      id: `${index}-adult-${each.adultPrice}-child-${each.childPrice}-capacity-${each.capacity}-roomPrice-${each.roomPrice}`,
      avg: (each.roomPrice + each.adultPrice * each.capacity) / each.capacity
    }))
    .sort((a, b) => a.avg - b.avg)

  let { adult, child } = guest
  const collection = []

  while (adult > 0) {
    for (let room of sortedRoomsWithAvg) {
      let adultInRoom = Math.min(Math.max(1, adult), room.capacity)
      let childInRoom = Math.min(child, room.capacity - adultInRoom)

      // 處理有小孩的需求下，確保一定會有一個大人在房
      if (childInRoom < child && adultInRoom > 1) {
        let maxChildInRoom = Math.min(child - childInRoom, adultInRoom - 1)
        childInRoom += maxChildInRoom
        adultInRoom -= maxChildInRoom
      }
  
      // 確保都有大人在房
      if (adultInRoom > 0) {
        let roomSum = room.roomPrice + room.adultPrice * adultInRoom + room.childPrice * childInRoom
        collection.push({
          id: room.id,
          adult: adultInRoom,
          child: childInRoom,
          price: roomSum,
          capacity: room.capacity
        })
  
        adult -= adultInRoom
        child -= childInRoom
      }

      // 分到沒有大人的時候停止
      if (adult === 0) break;
    }
  }

  if (child > 0) {
    console.log(`尚有 ${child} 為孩子沒有分配到`)
  }

  
  return collection
}
