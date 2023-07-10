export * from "./interfaces";

import { AccountDomain } from "./domain";
import { AccountRepositoryGateway } from "./gateway/repository-gateway";

import { createAccount } from "./services";



const repositoryGateway = new AccountRepositoryGateway();


export const AccountEntity = AccountDomain();


export const CreateAccountService = () => {
    return new createAccount({ repositoryGateway: repositoryGateway });
};



