import { GeneralGatewayService } from "@app/common/gateway/repository";

import { IAccount } from "../interfaces";

import { IAccountRepositoryGateway } from "./interfaces";

import { AccountUserCollectionModel, AUCollectionModel } from "./schema";

export class AccountRepositoryGateway
    extends GeneralGatewayService<AUCollectionModel, IAccount>
    implements IAccountRepositoryGateway {
    constructor() {
        super(AccountUserCollectionModel);
    }
}
