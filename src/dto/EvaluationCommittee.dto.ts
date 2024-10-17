export interface IEvaluationCommittee {
    EvaluationCommitteeId?: string;
Name?: string;
Designation?: string;
Email?: string;
Phone?: string;
TenderId?: string;

}

export class EvaluationCommitteeDto implements IEvaluationCommittee {
    constructor(
        public EvaluationCommitteeId?: string,
public Name?: string,
public Designation?: string,
public Email?: string,
public Phone?: string,
public TenderId?: string,

    ) {
    }
}
