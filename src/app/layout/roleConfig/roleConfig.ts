import { PermissionCategoryDto } from 'src/dto/Role.dto';
export type RolePermissions = {
    [dtoId: string]: string[] | undefined;
};

export type RoleConfig = {
    [roleName: string]: RolePermissions;
};

export const roleConfig: RoleConfig = {
};
export const PermissionCategories: PermissionCategoryDto[] = [
    
    {
        ServiceName: 'User',
        ServiceId: 'DTO2784',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'Role',
        ServiceId: 'DTO2786',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'Tender',
        ServiceId: 'DTO2791',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'Updates',
        ServiceId: 'DTO2804',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'TenderTeam',
        ServiceId: 'DTO2805',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'Equipments',
        ServiceId: 'DTO2807',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'EvaluationCommittee',
        ServiceId: 'DTO2809',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'OtherRequirements',
        ServiceId: 'DTO2810',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'BidBond',
        ServiceId: 'DTO2812',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'Company',
        ServiceId: 'DTO2813',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'PerfomanceBond',
        ServiceId: 'DTO2814',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'Notification',
        ServiceId: 'DTO2816',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'Member',
        ServiceId: 'DTO2821',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
   
    {
        ServiceName: 'equipmentdetails',
        ServiceId: 'DTO2485',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },

    {
        ServiceName: 'Payments',
        ServiceId: 'DTO2486',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },

    {
        ServiceName: 'OtherPayments',
        ServiceId: 'DTO3082',
        Permissions: [
            { Name: 'Add', Key: 'A' },
            { Name: 'Update', Key: 'U' },
            { Name: 'Read', Key: 'R' },
            { Name: 'Delete', Key: 'D' },
        ],
    },
];