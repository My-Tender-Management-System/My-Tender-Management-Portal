export interface IUpdates {
    UpdatesId?: string;
Status?: string;
Date?: string;
Remark?: string;
Category?: string;
FollowedBy?: string;
TenderId?: string;

}

export class UpdatesDto implements IUpdates {
    constructor(
        public UpdatesId?: string,
public Status?: string,
public Date?: string,
public Remark?: string,
public Category?: string,
public FollowedBy?: string,
public TenderId?: string,

    ) {
    }
}
