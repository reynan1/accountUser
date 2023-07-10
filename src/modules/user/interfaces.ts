import { IGeneralEntityProperties } from "@common/interface";

export interface IAccount extends IGeneralEntityProperties {
    firstname: string;
    middlename: string;
    lastname: string;
    mobileNumber: string;
    email: string;
}