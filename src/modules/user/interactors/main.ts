
import { CreateAccountService } from "../index";
import { IAccount } from '../interfaces'


export class AccountMainInteractor {

    public async createAccount(
        firstname: string,
        middlename: string,
        lastname: string,
        email: string,
        mobileNumber: string
    ) {



        const result = await CreateAccountService().execute({
            firstname,
            middlename,
            lastname,
            email,
            mobileNumber
        });

        if (!result) {
            throw new Error("result error");
        }


        return result;
    }



}




