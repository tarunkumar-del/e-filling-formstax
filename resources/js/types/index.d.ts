export interface Auth {
    user: User | null;
}

export interface Flash {
    success?: string;
    error?: string; 
}

export interface SharedData {
    name: string;

    quote: {
        message: string;
        author: string;
    };

    auth: Auth;

    flash: Flash;

    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];

    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;

    [key: string]: unknown;
}