export interface IMember {
    MemberId?: string;
FirstName?: string;
LastName?: string;
Email?: string;
ProfileImage?: string[];
CoverImage?: string[];
Country?: string;
Phone?: string;
Address?: string;
DOB?: string;
Branch?: string;
ContactNo?: string;

}

export class MemberDto implements IMember {
    constructor(
        public MemberId?: string,
public FirstName?: string,
public LastName?: string,
public Email?: string,
public ProfileImage?: string[],
public CoverImage?: string[],
public Country?: string,
public Phone?: string,
public Address?: string,
public DOB?: string,
public Branch?: string,
public ContactNo?: string,

    ) {
    }
}
