export interface IBidBond {
    BidBondId?: string;
    Amount?: string;
    Status?: string;
    Company?: string;
    RefNo?: string;
    ValidityPeriod?: {
        start: string; 
        end: string;  
    }; // Ensure this is included
    GuaranteeType?: string;
    BeneficiaryName?: string;
    Remark?: string;
    BeneficiaryMobile?: string;
    RequestedDate?: string;
    RequiredDate?: string;
    Bank?: string;
    Branch?: string;
    CollectedBy?: string;
    ReceivedDate?: string;
    TenderId?: string;
}

export class BidBondDto implements IBidBond {
    public ValidityPeriod?: { start: string; end: string }; // Declare ValidityPeriod here

    constructor(
        public BidBondId?: string,
        public Amount?: string,
        public Status?: string,
        public Company?: string,
        public RefNo?: string,
        ValidityPeriod?: { start: string; end: string }, // Add the ValidityPeriod parameter
        public GuaranteeType?: string,
        public BeneficiaryName?: string,
        public Remark?: string,
        public BeneficiaryMobile?: string,
        public RequestedDate?: string,
        public RequiredDate?: string,
        public Bank?: string,
        public Branch?: string,
        public CollectedBy?: string,
        public ReceivedDate?: string,
        public TenderId?: string,
    ) {
        // Initialize ValidityPeriod in the constructor if provided
        this.ValidityPeriod = ValidityPeriod;
    }
}
