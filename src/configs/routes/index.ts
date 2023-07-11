import { Router, Request, Response, NextFunction } from "express";




import { AccountMainRoute } from "@modules/user/routes/main";

/**
 * @classes
 */
export class MainRoute {
  private currentUserMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currentUser = req.headers.user
        ? JSON.parse(req.headers.user as any)
        : {};
      res.locals.user = currentUser;
    } catch (err) {
      console.log("#### No User found. ####");
      console.log("#### Error: ", err);
    }
    next();
  };
  /**
   *
   * @returns
   */
  public expose() {
    const appRoute = Router({ mergeParams: true });
    // public or the route that exposed to web server(nginx)
    appRoute.use("/api", this.routes());
    // private or internal api
    appRoute.use(this.routes());
    return appRoute;
  }
  /**
   * put all routes here.
   * @returns
   */
  private routes = () => {
    const route = Router({ mergeParams: true });
    route.use('/account', new AccountMainRoute().expose());
    // route.use('/admin-dashboard', smsRouter)
    // route.use('/settings', new SettingsRoute().expose() )
    /* route.use("/settings", new SettingsRoute().expose());
    route.use("/support", new SupportRoute().expose());
    route.use("/supportConnectSales", new SupportConnectSalesRoute().expose());
    route.use("/:branchId/email", emailRouter);
    route.use("/accounts", AccountRouter);
    route.use("/:branchId/sms", this.currentUserMiddleware, smsRouter); */


    return route;
  };
}
