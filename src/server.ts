import express, { Request, Response } from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import userRoutes from './models/handlers/user';
import productRoutes from './models/handlers/product';
import orderRoutes from './models/handlers/order';



const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

export const app: express.Application = express()
const address: string = "127.0.0.1:3000"

app.use(bodyParser.json())
app.use(cors(corsOptions))

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

userRoutes(app);
productRoutes(app);
orderRoutes(app);


app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})
