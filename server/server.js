// server/server.js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

// Allow Render to set port via process.env.PORT
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: '*', // für Tests; später auf deine Domain einschränken
    methods: ['GET','POST']
  },
  // pingInterval/pingTimeout default ok
});

// In-memory sessions map: sessionCode -> lastField
// For production consider Redis or DB + cleanup 
const sessions = {};

io.on('connection', (socket) => {
  console.log('client connected', socket.id);

  // join a session room
  socket.on('join-session', (sessionCode) => {
    if(!sessionCode) return;
    socket.join(sessionCode);
    console.log(`socket ${socket.id} joined session ${sessionCode}`);

    // send back current lastField if exists
    const cur = sessions[sessionCode] ? sessions[sessionCode].lastField : 0;
    socket.emit('session-state', { lastField: cur || 0 });
  });


  socket.on('pick-field', ({ sessionCode, field, color }) => {
    if(!sessionCode) return;
    field = Number(field) || 0;
    if(field < 0 || field > 9) return;
  
    sessions[sessionCode] = sessions[sessionCode] || { lastField: 0 };
    sessions[sessionCode].lastField = field;
    sessions[sessionCode].color = color || 'red'; // Farbe speichern
    sessions[sessionCode].ts = Date.now();
  
    // Broadcast inkl. Farbe
    io.to(sessionCode).emit('field-changed', { field, color: sessions[sessionCode].color });
  });


  // controller requests "next" random (not used for C mode but kept)
  socket.on('next-field-random', (sessionCode) => {
    if(!sessionCode) return;
    sessions[sessionCode] = sessions[sessionCode] || { lastField: 0 };
    let prev = sessions[sessionCode].lastField || 0;
    let next;
    do { next = Math.floor(Math.random() * 9) + 1; } while(next === prev);
    sessions[sessionCode].lastField = next;
    sessions[sessionCode].ts = Date.now();
    io.to(sessionCode).emit('field-changed', { field: next });
    console.log(`session ${sessionCode} random -> ${next}`);
  });

  socket.on('disconnect', () => {
    console.log('client disconnected', socket.id);
  });
});

// Basic route for health
app.get('/', (req,res) => res.send('Football Matrix Socket Server is running'));

server.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
