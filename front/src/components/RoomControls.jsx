import { getUiTexts } from "../i18n/uiTexts";

function RoomControls({
  createRoom,
  roomInput,
  setRoomInput,
  joinRoom,
  roomId,
  usersCount,
  listenLanguage,
}) {
  const t = getUiTexts(listenLanguage);

  return (
    <>
      <button onClick={createRoom}>
        {t.createRoom}
      </button>

      <div className="join-box">
        <input
          value={roomInput}
          onChange={(e) =>
            setRoomInput(e.target.value)
          }
          placeholder={t.roomCode}
        />

        <button onClick={joinRoom}>
          {t.join}
        </button>
      </div>

      {roomId && (
        <div className="room-info">
          <p>
            {t.room}: <strong>{roomId}</strong>
          </p>

          <p>
            {t.connectedUsers}:{" "}
            <strong>{usersCount}/2</strong>
          </p>
        </div>
      )}
    </>
  );
}

export default RoomControls;