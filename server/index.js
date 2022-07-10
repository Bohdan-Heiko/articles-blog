import express from 'express'
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from 'cors'
import config from 'config'

import { login, registration } from './controllers/auth.controller.js'
import { registerValidator } from './validation/auth.validation.js';
const app = express()

app.use(cors())
app.use(bodyParser.json());



app.post('/auth/login', login)
app.post('/auth/registration', registerValidator, registration)




const start = async () => {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => console.log('db is connected')).catch((e) => console.log(e))
    app.listen(config.get('PORT'), () => console.log(`App has been started on port 4444...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()