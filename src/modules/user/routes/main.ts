import { Router } from 'express'

import { AccountMainController } from '../controllers';

import {

} from './index';


export class AccountMainRoute {


    public expose() {
        const appRouter = Router({ mergeParams: true });

        appRouter.use('/registration', new AccountMainController().expose());
        return appRouter;
    }
}