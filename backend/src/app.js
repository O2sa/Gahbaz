require('dotenv').config();
require('express-async-errors');
// express

const express = require('express');
const app = express();

// rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// database
const connectDB = require('./configs/connect');

//  routers
const studentRouter = require('./routes/studentRoutes');
const adminRouter = require('./routes/adminRoutes');
const teacherRouter = require('./routes/teacherRoutes');
const collageRouter = require('./routes/collageRoutes');
const subjectRouter = require('./routes/subjectRoutes');
const semesterRouter = require('./routes/semesterRoutes');
const courseRouter = require('./routes/courseRoutes');
const majorRouter = require('./routes/majorRoutes');
const semesterTemplateRoute = require('./routes/semesterTemplateRoutes');



// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );
// app.use(helmet());
// app.use(cors());
// app.use(xss());
// app.use(mongoSanitize());

app.use(express.json());
// app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
// app.use(fileUpload());

//setup apis
app.use('/api/v1', studentRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1', teacherRouter);
app.use('/api/v1', collageRouter);
app.use('/api/v1', courseRouter);
app.use('/api/v1', semesterRouter);
app.use('/api/v1', majorRouter);
app.use('/api/v1', subjectRouter);
app.use('/api/v1', semesterTemplateRoute);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
