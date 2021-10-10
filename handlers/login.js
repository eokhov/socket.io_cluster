import uidStore from '../helpers/uidStore.js';

const loginHandler = (io, socket) => {
  const login = async () => {
    try {
      console.log(socket.handshake.query.uid, socket.id);
      await uidStore.save(socket.handshake.query.uid, socket.id);
    } catch (error) {
      console.error(error);
    }
  };

  socket.on('login', login);
};

export default loginHandler;
