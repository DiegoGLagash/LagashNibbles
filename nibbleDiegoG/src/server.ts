import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import { IndexRoute } from "./routes/index";
import { NextMoveRoute } from "./routes/nextMove";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();

    //add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    //empty for now
  }

	/**
	  * Configure application
	  *
	  * @class Server
	  * @method config
	  */
	public config() {
	  //add static paths
	  this.app.use(express.static(path.join(__dirname, "public")));

	  //configure pug
	  this.app.set("views", path.join(__dirname, "views"));
	  this.app.set("view engine", "pug");

	  //use logger middlware
	  this.app.use(logger("dev"));

		//allow CORS calls
		this.app.use(function(req, res, next) {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
				res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

				// intercept OPTIONS method
				if ('OPTIONS' === req.method) {
					res.sendStatus(200);
				}
				else {
					next();
				}
		});

		//use json form parser middlware
	  this.app.use(bodyParser.json());

	  //catch 404 and forward to error handler
	  this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
	      err.status = 404;
	      next(err);
	  });

	  //error handling
	  this.app.use(errorHandler());
	}

	/**
	  * Create router.
	  *
	  * @class Server
	  * @method config
	  * @return void
	  */
	private routes() {
	  let router: express.Router;
	  router = express.Router();

	  //IndexRoute
	  IndexRoute.create(router);

		NextMoveRoute.create(router);

	  //use router middleware
	  this.app.use(router);
	}
}