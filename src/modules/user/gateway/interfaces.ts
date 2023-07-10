import { IGeneralRepositoryGateway } from "@app/common/gateway/repository";
import { IAccount } from "../interfaces";
import { AUCollectionModel } from "./schema";


export interface IAccountRepositoryGateway extends IGeneralRepositoryGateway<AUCollectionModel, IAccount> { }