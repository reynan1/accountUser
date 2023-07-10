import { IGeneralServiceDependencies } from "@app/common/interface";
import { IAccountRepositoryGateway } from "../gateway/interfaces";

export interface IAccountServiceDependencies
    extends IGeneralServiceDependencies<IAccountRepositoryGateway> { }