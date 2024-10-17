export interface IOtherRequirements {
    OtherRequirementsId?: string;
    Warranty?: Number;
    RequiredDocuments?: string[];
    MaintenanceFee?: Number;
    DeliveryPeriod?: string;
    DeliveryDate?: string;
    DeliveryPlace?: string;
    PaymentMethod?: string;
    TransportCharges?: Number;
    ValidityPeriod?: {
        start: string; 
        end: string;  
    };
    SpecificRequirement?: string;
    TenderId?: string;
}

export class OtherRequirementsDto implements IOtherRequirements {
    public ValidityPeriod?: { start: string; end: string };
    constructor(
        public OtherRequirementsId?: string,
        public Warranty?: Number,
        public RequiredDocuments?: string[],
        public MaintenanceFee?: Number,
        public DeliveryPeriod?: string,
        public DeliveryDate?: string,
        public DeliveryPlace?: string,
        public PaymentMethod?: string,
        public TransportCharges?: Number,
        ValidityPeriod?: { start: string; end: string },
        public SpecificRequirement?: string,
        public TenderId?: string
    ) {
        this.ValidityPeriod = ValidityPeriod;
    }
}
