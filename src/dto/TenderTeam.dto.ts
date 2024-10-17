export interface ITenderTeam {
    TenderTeamId?: string;
TeamName?: string;
TeamLead?: string;
NumberOfMembers?: string;
IsActive?: string;
Members?: string[];
TenderId?: string;

}

export class TenderTeamDto implements ITenderTeam {
    constructor(
        public TenderTeamId?: string,
public TeamName?: string,
public TeamLead?: string,
public NumberOfMembers?: string,
public IsActive?: string,
public Members?: string[],
public TenderId?: string,

    ) {
    }
}
