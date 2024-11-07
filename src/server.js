const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Importa ObjectId aquí
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
const uri = "mongodb+srv://davidalfonsovega:basedatos12345@cluster0.gfs7b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let usersCollection;

client.connect().then(() => {
  console.log("Conectado a MongoDB!");
  usersCollection = client.db("usuariosSalud").collection("collectionSalud");
});

// Crear usuario
app.post('/usuarios', (req, res) => {
  usersCollection.insertOne(req.body)
    .then(result => res.status(201).send(result))
    .catch(error => res.status(400).send({ error: 'Error al crear el usuario' }));
});

// Leer todos los usuarios
app.get('/usuarios', (req, res) => {
  usersCollection.find().toArray()
    .then(users => res.send(users))
    .catch(error => res.status(500).send({ error: 'Error al obtener los usuarios' }));
});

// Leer un usuario por ID
app.get('/usuarios/:id', (req, res) => {
  const id = new ObjectId(req.params.id); // Convertir el ID a ObjectId
  usersCollection.findOne({ _id: id })
    .then(user => {
      if (!user) return res.status(404).send({ error: 'Usuario no encontrado' });
      res.send(user);
    })
    .catch(error => res.status(500).send({ error: 'Error al obtener el usuario' }));
});

// Actualizar usuario por ID
app.put('/usuarios/:id', (req, res) => {
  const id = new ObjectId(req.params.id); // Convertir el ID a ObjectId
  usersCollection.updateOne({ _id: id }, { $set: req.body })
    .then(result => {
      if (result.matchedCount === 0) return res.status(404).send({ error: 'Usuario no encontrado' });
      res.send(result);
    })
    .catch(error => res.status(400).send({ error: 'Error al actualizar el usuario' }));
});

// Eliminar usuario por ID
app.delete('/usuarios/:id', (req, res) => {
  const id = new ObjectId(req.params.id); // Convertir el ID a ObjectId
  usersCollection.deleteOne({ _id: id })
    .then(result => {
      if (result.deletedCount === 0) return res.status(404).send({ error: 'Usuario no encontrado' });
      res.send({ message: 'Usuario eliminado' });
    })
    .catch(error => res.status(500).send({ error: 'Error al eliminar el usuario' }));
});

// Definir puerto y arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
