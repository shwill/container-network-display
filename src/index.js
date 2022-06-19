import express from "express"
import exphbs from 'express-handlebars';

// .. and the context we are running in
import injectSystemInformation, { getSystemInformation } from "./middleware/injectSystemInformation.js";
import routes from "./route/index.js"


// Configuration
const PORT = process.env.PORT || 3000;
const PROTO = process.env.PROTO || "http"

// Initialization
const app = express();

// configure view engine
const hbs = exphbs.create({
    extname: '.handlebars',
    defaultLayout: null,
    helpers: {
        strEqual: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    }
})
app.engine('handlebars', hbs.engine);


app.set('view engine', 'handlebars');
app.set('views', './views');

// set static file directory
app.use(express.static('public'));

// inject middlewares
app.use(injectSystemInformation)

// Routes
app.use(routes);

// Starting the webserver
app.listen(PORT, async () => {
    const SYSTEM_INFORMATION = getSystemInformation();
    console.log(`${SYSTEM_INFORMATION.app.name} v${SYSTEM_INFORMATION.app.version} running on ${PROTO}://${SYSTEM_INFORMATION.hostname}:${PORT}`)
})