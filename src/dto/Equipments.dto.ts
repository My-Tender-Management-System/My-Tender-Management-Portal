export interface IEquipments {
    EquipmentsId?: string;
Name?: string;
Make?: string;
Model?: string;
RefNo?: string;
Country?: string;
UnitPrice?: Number;

}

export class EquipmentsDto implements IEquipments {
    constructor(
        public EquipmentsId?: string,
public Name?: string,
public Make?: string,
public Model?: string,
public RefNo?: string,
public Country?: string,
public UnitPrice?: Number,

    ) {
    }
}
