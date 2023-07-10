import { IAccount } from "./interfaces";

export const AccountDomain = () => {
    return class AccountEntity implements IAccount {
        readonly _id: string = "";

        private _firstname: string = "";
        private _middlename: string = "";
        private _lastname: string = "";
        private _email: string = "";
        private _mobileNumber: string = "";

        readonly createdAt: number = Date.now();
        readonly updatedAt: number = Date.now();

        constructor(data: Partial<IAccount>) {
            let {

                firstname = this.firstname,
                lastname = this.lastname,
                middlename = this.middlename,
                email = this.email,
                mobileNumber = this.mobileNumber,

                createdAt = this.createdAt,
                updatedAt = this.updatedAt,
            } = data;

            this.firstname = firstname;
            this.middlename = middlename;
            this.lastname = lastname;
            this.email = email;
            this.mobileNumber = mobileNumber;

            this.createdAt = createdAt;
            this.updatedAt = updatedAt;

        }


        /**
        * Getter source
        * @return { string }
        */

        public get firstname(): string {
            return this._firstname;
        }

        /**
         * Setter source
         * @return { string }
         */

        public set firstname(value: string) {
            this._firstname = value;
        }

        /**
         * Getter IssueType
         * @return { string }
         */

        public get middlename(): string {
            return this._middlename;
        }

        /**
         * Setter IssueType
         * @return { string }
         */

        public set middlename(value: string) {
            this._middlename = value;
        }

        /**
         * Getter reportIssueMessage
         * @return { string }
         */

        public get lastname(): string {
            return this._lastname;
        }

        /**
         * Setter reportIssueMessage
         * @return { string }
         */

        public set lastname(value: string) {
            this._lastname = value;
        }

        /**
         * Getter source
         * @return { string }
         */

        public get email(): string {
            return this._email;
        }

        /**
         * Setter source
         * @return { string }
         */

        public set email(value: string) {
            this._email = value;
        }

        /**
    * Getter source
    * @return { string }
    */

        public get mobileNumber(): string {
            return this._mobileNumber;
        }

        /**
         * Setter source
         * @return { string }
         */

        public set mobileNumber(value: string) {
            this._mobileNumber = value;
        }

    };
};
