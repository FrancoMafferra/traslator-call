function RoomControls({
  createRoom,
  roomInput,
  setRoomInput,
  joinRoom,
  roomId,
  usersCount,
}) {
  return (
    <>
      <button onClick={createRoom}>
        Crear sala
      </button>

      <div className="join-box">
        <input
          value={roomInput}
          onChange={(e) =>
            setRoomInput(e.target.value)
          }
          placeholder="Código de sala"
        />

        <button onClick={joinRoom}>
          Unirse
        </button>
      </div>

      {roomId && (
        <div className="room-info">
          <p>
            Sala: <strong>{roomId}</strong>
          </p>

          <p>
            Usuarios conectados:{' '}
            <strong>{usersCount}/2</strong>
          </p>
        </div>
      )}
    </>
  );
}

export default RoomControls;