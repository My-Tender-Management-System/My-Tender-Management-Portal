export interface IOtherPayments {
    OtherPaymentsId?: string;
    Amount?: string;
    Date?: string;
    Description?: string;
    PaymentForUpload?: string[];
    TenderId?: string;
}

export class OtherPaymentsDto implements IOtherPayments {
    constructor(
        public OtherPaymentsId?: string,
        public Amount?: string,
        public Date?: string,
        public Description?: string,
        public PaymentForUpload?: string[],
        public TenderId?: string
    ) {}
}
