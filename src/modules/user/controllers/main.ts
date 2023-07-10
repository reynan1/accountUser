import { Request, Response } from 'express'
import * as HttpStatus from 'http-status'

import { AccountMainInteractor } from '../interactors'

export class AccountMainController {

    private readonly accountMainInteractor = new AccountMainInteractor();

    public accountRegistration = async (req: Request, res: Response) => {
        try {

            const firstname = typeof req.body.firstName === "string" ? req.body.firstName : "";
            const middlename = typeof req.body.middleName === "string" ? req.body.middleName : "";
            const lastname = typeof req.body.lastName === "string" ? req.body.lastName : "";
            const mobileNumber = typeof req.body.mobileNumber === "string" ? req.body.mobileNumber : "";
            const email = typeof req.body.email === "string" ? req.body.email : "";

            const accRegisResult = await this.accountMainInteractor.createAccount(
                firstname,
                middlename,
                lastname,
                mobileNumber,
                email
            );

            res.status(HttpStatus.OK).json({
                success: true,
                data: accRegisResult
            })

        } catch (error) {
            console.log(error);
        }
    }

}