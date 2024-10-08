'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form'

import { RoomResult, Guest, Room } from '../../utils'

import CustomInputNumber from '../CustomInputNumber'
import { getDefaultRoomAllocation } from '../../utils'

const formatDefaultValues = (rooms: Room[], defaultRooms: RoomResult[]) => {
  return rooms.map((room, id) => {
    const defaultRoom = defaultRooms.find(each => each.id === `${id}-adult-${room.adultPrice}-child-${room.childPrice}-capacity-${room.capacity}-roomPrice-${room.roomPrice}`)
    return ({
      adult: defaultRoom?.adult || 0,
      child: defaultRoom?.child || 0
    })
  })
}

const STEP = 1
const RoomAllocation = ({ guest, rooms, onChange }: { guest: Guest, rooms: Room[], onChange?: (result: RoomResult[]) => void }) => {
  const defaultRooms = useMemo(() => getDefaultRoomAllocation(guest, rooms), [guest, rooms])
  const [totalPrice, setTotalPrice] = useState(defaultRooms.reduce((acc, val) => acc + val.price, 0))
  const { control, formState, watch } = useForm<{
    rooms: RoomResult[]
  }>({
    mode: 'onChange',
    defaultValues: {
      rooms: formatDefaultValues(rooms, defaultRooms)
    }
  })
  const { errors } = formState
  const formValues = watch('rooms')
  // TODO: handleOnBlur
  const handleOnBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    console.log('handleOnBlur', e)
  }, [])
  const formValuesGuest = formValues.reduce((acc, val) => ({
    adult: acc.adult += +val.adult,
    child: acc.child += +val.child
  }), { adult: 0, child: 0 })

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.rooms) {
        const result = value.rooms.map((each, index) => {
          if (each?.adult === 0 && each?.child === 0) {
            return null
          }
          return ({
            ...each,
            price: (each?.adult || 0) * rooms[index]?.adultPrice + (each?.child || 0) * rooms[index]?.childPrice + (rooms[index]?.roomPrice)
        })
        }).filter(each => each !== null)
        onChange?.(result as RoomResult[])
        setTotalPrice(result.reduce((acc, val) => acc + val.price, 0))
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, rooms, onChange])

  return (
    <div className="">
      <div className='text-left text-gray-600 text-m bg-sky-100 p-4 rounded-md'>
        {`尚未分配人數：${guest.adult - formValuesGuest.adult} 大人，${guest.child - formValuesGuest.child} 小孩`}
      </div>
      {rooms.map((each, index) => {
        const adultInRoom = +formValues[index].adult
        const childInRoom = +formValues[index].child
        return (
        <div
          className='flex-column text-left m-4'
          key={`${index}-adult-${each.adultPrice}-child-${each.childPrice}-capacity-${each.capacity}-roomPrice-${each.roomPrice}`}
        >
          <h3>{`房間： ${adultInRoom + childInRoom} 人`}</h3>
          <div className='flex flex-row justify-between items-center my-4'>
            <div className='flex-column items-center'>
              <p>大人</p>
              <span className='text-gray-400'>年齡 20+</span>
            </div>
            <Controller
              name={`rooms.${index}.adult`}
              control={control}
              rules={{
                min: childInRoom > 0 ? 1 : 0,
                max: Math.min(
                  each.capacity - childInRoom,
                  adultInRoom + (guest.adult - formValuesGuest.adult)
                )
              }}
              render={({ field }) => (
                <CustomInputNumber
                  {...field}
                  step={STEP}
                  onBlur={handleOnBlur}
                  min={childInRoom > 0 ? 1 : 0}
                  max={Math.min(
                    each.capacity - childInRoom,
                    adultInRoom + (guest.adult - formValuesGuest.adult)
                  )}
                  disabled={!!errors.rooms?.[index]?.adult}
                />
              )}
            />
          </div>
          <div className='flex flex-row justify-between cent items-center'>
            <div>小孩</div>
            <Controller
              name={`rooms.${index}.child`}
              control={control}
              rules={{
                min: 0,
                max: Math.min(
                  adultInRoom === 0 ? 0 : each.capacity - adultInRoom,
                  childInRoom + (guest.child - formValuesGuest.child)
                ),
              }}
              render={({ field }) => (
                <CustomInputNumber
                  {...field}
                  step={STEP}
                  onBlur={handleOnBlur}
                  min={0}
                  max={Math.min(
                    adultInRoom === 0 ? 0 : each.capacity - adultInRoom,
                    childInRoom + (guest.child - formValuesGuest.child)
                  )}
                  disabled={!!errors.rooms?.[index]?.child}
                />
              )}
            />
          </div>
          {index < rooms.length - 1 && <hr className='my-4' />}
        </div>
      )})}
      <div className='text-right text-gray-600 text-m bg-sky-100 p-4 rounded-md'>總價：{totalPrice}</div>
    </div>
  )
}

export default RoomAllocation
