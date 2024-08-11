import RoomAllocation from '../components/RoomAllocation'

export default function Home() {
  return (
    <main>
      <div className='text-center sm:text-left'>
        <div className=''>{`住客人數：${guest.adult} 位大人，${guest.child} 位小孩 / ${rooms.length} 房`}</div>
        <RoomAllocation
          guest={guest}
          rooms={rooms}
          // TODO: onChange
          // onChange={result => console.log(result)}
        />
      </div>
    </main>
  );
}
