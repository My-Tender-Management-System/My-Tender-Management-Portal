export interface IEquipmentDetails {
EquipmentDetailsId?: string;
EquipmentID?: string;
Qty?: Number;
BidAmount?: Number;
BidBankCharge?: Number;
Remark?: string;
Cost?: Number;
TenderId?: string;
Status?: string;
}

export class EquipmentDetailsDto implements IEquipmentDetails {
constructor(
public EquipmentDetailsId?: string,
public EquipmentID?: string,
public Qty?: Number,
public BidAmount?: Number,
public BidBankCharge?: Number,
public Remark?: string,
public Cost?: Number,
public TenderId?: string,
Status?: string,

    ) {
    }
}
