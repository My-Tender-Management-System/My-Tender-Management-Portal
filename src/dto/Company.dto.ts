export interface ICompany {
    CompanyId?: string;
    Name?: string;
    Location?: string;
    ContactPerson?: string;
    ContactNumber?: string;
}

export class CompanyDto implements ICompany {
    constructor(
        public CompanyId?: string,
        public Name?: string,
        public Location?: string,
        public ContactPerson?: string,
        public ContactNumber?: string
    ) {}
}
