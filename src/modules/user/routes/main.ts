import { Router } from 'express'

import { AccountMainController } from '../controllers';


export class AccountMainRoute {
    private app: Router;
    private readonly accountMainController: AccountMainController;

    constructor() {
        this.app = Router({ mergeParams: true });
        this.accountMainController = new AccountMainController();
    }


    public expose() {
        this.app.use('/registration', this.accountMainController.accountRegistration);

        return this.app;
    }
}