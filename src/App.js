import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import './App.css'

const socket = io('http://localhost:3001');

const App = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [inConnect, setInConnect] = useState(false);
  const [message, setMessage] = useState('');

  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on('chat_message', message => {
      setMessageList(prevMessages => [...prevMessages, message]);
    });
    return () => {
      socket.off('chat_message');
    };
  }, []);
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    socket.emit('user_connect', { username });
    setInConnect(true)
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    socket.emit('join_room', { room });
    setInRoom(true);
  };

  const handleLeaveRoom = () => {
    socket.emit('remove_user_room', { room });
    setInRoom(false);
    setRoom('');
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    socket.emit('send_message', { room, message });
    setMessage('');
  };
  return (
      <div>
        {!inConnect ? (
            <form onSubmit={handleUsernameSubmit}>
              <input
                  type="text"
                  placeholder="Введіть ім'я користувача"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <button type="submit">Підключитися</button>
            </form>
        ) : !inRoom ? (
            <form onSubmit={handleRoomSubmit}>
              <input
                  type="text"
                  placeholder="Введіть назву кімнати"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
              />
              <button type="submit">Приєднатися</button>
            </form>
        ) : (
            <div>
              <p>Зараз ви знаходитесь в кімнаті: {room}</p>
              <button onClick={handleLeaveRoom}>Вийти з кімнати</button>
              <form onSubmit={handleMessageSubmit}>
                <input
                    type="text"
                    placeholder="Введіть повідомлення"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">Відправити</button>
              </form>
              <div>
                {messageList.map((msg, index) => (
                    <p key={index} className={msg.type === 'system' ? 'system-message' : 'user-message'}>
                      {msg.username}: {msg.message}
                    </p>
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default App;
