export interface ISaleUsers{
    id: number;
    email: string;
    password: string;
    confirm_password: string;
    is_sale?: boolean;
    is_active?: boolean;
}