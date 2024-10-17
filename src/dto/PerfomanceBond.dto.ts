export interface IPerfomanceBond {
    PerfomanceBondId?: string;
    Name?: string;
    Amount?: string;
    ValidityPeriod?: {
        start: string;
        end: string;
    };
    RefNo?: string;
    RequestedDate?: string;
    RequiredDate?: string;
    ReceivedDate?: string;
    CollectedBy?: string;
    TenderId?: string;
}

export class PerfomanceBondDto implements IPerfomanceBond {
    public ValidityPeriod?: { start: string; end: string };

    constructor(
        public PerfomanceBondId?: string,
        public Name?: string,
        public Amount?: string,
        ValidityPeriod?: { start: string; end: string },
        public RefNo?: string,
        public RequestedDate?: string,
        public RequiredDate?: string,
        public ReceivedDate?: string,
        public CollectedBy?: string,
        public TenderId?: string
    ) {
        this.ValidityPeriod = ValidityPeriod;
    }
}
