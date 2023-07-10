import { SchemaTypeOptions, Document, Schema, model } from "mongoose";

import { ACCOUNT_COLLECTION_NAME } from "../constants";
import { IAccount } from "../interfaces";

export interface AUCollectionModel extends IAccount, Document {
    _id: string;
}


export const AccountSchemaObject: Record<keyof IAccount, SchemaTypeOptions<any>> = {
    _id: {
        type: String,
        auto: true,
    },

    firstname: {
        type: String,
        required: true,
    },

    middlename: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },

    mobileNumber: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Number,
        default: 0,
    },

    updatedAt: {
        type: Number,
        default: 0
    },
};


const AccountSchema: Schema = new Schema(AccountSchemaObject, {
    timestamps: {
        currentTime: Date.now,
    },
});


export const AccountUserCollectionModel = model<AUCollectionModel>(
    ACCOUNT_COLLECTION_NAME,
    AccountSchema
);