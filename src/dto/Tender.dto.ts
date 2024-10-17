export interface ITender {
    TenderId?: string;
    Title?: string;
    Description?: string;
    OpeningDate?: string;
    ClosingDate?: string;
    Status?: string;
    TenderNumber?: string;
    DocumentFee?: string;
    TenderSource?: string;
    AdvertisementDate?: string;
    LastCollectableDate?: string;
    CollectionPlace?: string;
    CollectedBy?: string;
    CollectedDate?: string;
    // UpdatesId?: string;
    // BidBondId?: string;
    // PerfomanceBondId?: string;
    completionPercentage?: number;
    TenderScore?: number;
}

export class TenderDto implements ITender {
    constructor(
        public TenderId?: string,
        public Title?: string,
        public Description?: string,
        public OpeningDate?: string,
        public ClosingDate?: string,
        public Status?: string,
        public TenderNumber?: string,
        public DocumentFee?: string,
        public TenderSource?: string,
        public AdvertisementDate?: string,
        public LastCollectableDate?: string,
        public CollectionPlace?: string,
        public CollectedBy?: string,
        public CollectedDate?: string,
        public completionPercentage?: number,
        public TenderScore?: number,
        // public UpdatesId?: string,
        // public BidBondId?: string,
        // public PerfomanceBondId?: string
    ) {}
}
