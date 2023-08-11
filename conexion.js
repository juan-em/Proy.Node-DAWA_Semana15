const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  connection.query('SELECT * FROM alumnos', (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('index', { datos: resultados });
  });
});

app.post('/', (req, res) => {
  const nuevoDato = req.body.nuevoDato;
  const columna2 = req.body.columna2;
  const columna3 = req.body.columna3;

  const consulta = 'INSERT INTO alumnos (columna1, columna2, columna3) VALUES (?, ?, ?)';
  connection.query(consulta, [nuevoDato, columna2, columna3], (error, results) => {
    if (error) {
      console.error('Error al insertar datos: ', error);
      return;
    }
    console.log('Dato insertado exitosamente');
    res.redirect('/');
  });
});


app.get('/editar/:id', (req, res) => {
  const id = req.params.id;
  const consulta = 'SELECT * FROM alumnos WHERE id = ?';

  connection.query(consulta, [id], (error, results) => {
    if (error) {
      console.error('Error al obtener el dato: ', error);
      return;
    }
    res.render('editar', { dato: results[0] });
  });
});

app.post('/editar/:id', (req, res) => {
  const id = req.params.id;
  const nuevoDato = req.body.nuevoDato;
  const columna2 = req.body.columna2;
  const columna3 = req.body.columna3;

  const consulta = 'UPDATE alumnos SET columna1 = ?, columna2 = ?, columna3 = ? WHERE id = ?';

  connection.query(consulta, [nuevoDato, columna2, columna3, id], (error, results) => {
    if (error) {
      console.error('Error al actualizar el dato: ', error);
      return;
    }
    console.log('Dato actualizado exitosamente');
    res.redirect('/');
  });
});


app.get('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  const consulta = 'DELETE FROM alumnos WHERE id = ?';

  connection.query(consulta, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar el dato: ', error);
      return;
    }
    console.log('Dato eliminado exitosamente');
    res.redirect('/');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'laboratorio15'
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a MySQL: ', error);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});


//busqueda por join y where
app.get('/buscar', (req, res) => {
  res.render('buscar');
});

app.post('/buscar/materiasPorAlumno', (req, res) => {
  const nombreAlumnoMateria = req.body.nombreAlumnoMateria;
  const consulta = `
    SELECT m.nombre AS nombreMateria
    FROM alumnos a
    JOIN materias m ON a.id = m.alumno_id
    WHERE a.columna1 = ?
  `;

  connection.query(consulta, [nombreAlumnoMateria], (error, resultados) => {
    if (error) {
      console.error('Error al buscar las materias por alumno: ', error);
      return;
    }
    res.render('buscar', { materiasPorAlumnoResultados: resultados });
  });
});

// Ruta para buscar alumnos por nombre de materia
app.post('/buscar/alumnosPorMateria', (req, res) => {
  const nombreMateriaAlumno = req.body.nombreMateriaAlumno;
  const consulta = `
    SELECT a.columna1 AS nombreAlumno
    FROM alumnos a
    JOIN materias m ON a.id = m.alumno_id
    WHERE m.nombre = ?
  `;

  connection.query(consulta, [nombreMateriaAlumno], (error, resultados) => {
    if (error) {
      console.error('Error al buscar los alumnos por materia: ', error);
      return;
    }
    res.render('buscar', { alumnosPorMateriaResultados: resultados });
  });
});

// Ruta para buscar alumnos inscritos en más de una materia
app.post('/buscar/alumnosMultimateria', (req, res) => {
  const consulta = `
    SELECT a.columna1 AS nombreAlumno, m.nombre AS nombreMateria
    FROM alumnos a
    JOIN materias m ON a.id = m.alumno_id
    GROUP BY a.columna1, m.nombre
    HAVING COUNT(m.alumno_id) > 1
  `;

  connection.query(consulta, (error, resultados) => {
    if (error) {
      console.error('Error al buscar los alumnos con más de una materia: ', error);
      return;
    }
    res.render('buscar', { alumnosMultimateriaResultados: resultados });
  });
});




// Cerrar la conexión cuando sea necesario
// connection.end();
