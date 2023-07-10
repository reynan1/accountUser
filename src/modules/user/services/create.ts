import { IAccountServiceDependencies } from "./interface";
import { IAccount } from "../interfaces";
import { AccountEntity } from "..";

export class createAccount {
    constructor(private readonly deps: IAccountServiceDependencies) { }

    public async execute(data: Partial<IAccount>) {
        try {


            const accountEntity = new AccountEntity({
                ...data
            });

            const createAccountResult = await this.deps.repositoryGateway.insertOne({
                firstname: accountEntity.firstname,
                middlename: accountEntity.middlename,
                lastname: accountEntity.lastname,
                email: accountEntity.email,
                mobileNumber: accountEntity.mobileNumber,
                updatedAt: accountEntity.updatedAt,
                createdAt: accountEntity.createdAt,
            });

            if (!createAccountResult) {
                throw new Error("create account result >>>>>> error data: ");
            }

            return createAccountResult;
        } catch (error) {
            throw error;
        }
    }
}
