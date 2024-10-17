type RelationshipConfig = {
    [dtoId: string]: string[];
};

export type dtoIdNameConfig = {
    name : string;
    id : string;
}
const dtoIds: dtoIdNameConfig[] = [
    { name: "User", id: "DTO2784" },
{ name: "Role", id: "DTO2786" },
{ name: "Tender", id: "DTO2791" },
{ name: "Updates", id: "DTO2804" },
{ name: "Tender Team", id: "DTO2805" },
{ name: "Equipments", id: "DTO2807" },
{ name: "equipment Details", id: "DTO2485" },

{ name: "Evaluation Committee", id: "DTO2809" },
{ name: "Other Requirements", id: "DTO2810" },
{ name: "BidBond", id: "DTO2812" },
{ name: "Company", id: "DTO2813" },
{ name: "Perfomance Bond", id: "DTO2814" },
{ name: "Notification", id: "DTO2816" },
{ name: "Member", id: "DTO2821" },
{ name: "Payments", id: "DTO2486" },
{ name: "OtherPayments", id: "DTO3082" },


];

export const relationshipConfig: RelationshipConfig = {
    DTO2791:["DTO2804","DTO2809","DTO2810","DTO2812","DTO2814","DTO2485","DTO2486","DTO3082"],
			DTO2805:["DTO2821"],	
};

export const getDtoNameById = (id: string): string | undefined => {
  const dto = dtoIds.find((dto) => dto.id === id);
  return dto ? dto.name : undefined;
}

export const getRelationshipListByDtoId = (dtoId: string): dtoIdNameConfig[] | undefined => {
  const relatedDtoIds = relationshipConfig[dtoId];

  if (relatedDtoIds === undefined) {
    return undefined;
  }

  // Map related DTO IDs to DtoIdNameConfig objects
  const relatedDtoObjects = relatedDtoIds.map((id) => {
    const dto = dtoIds.find((dto) => dto.id === id);
    return dto ? dto : { name: id, id }; // Use a default object if not found
  });

  return relatedDtoObjects;
};