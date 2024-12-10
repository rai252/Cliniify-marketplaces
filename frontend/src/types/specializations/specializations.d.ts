export interface ISpecialization {
    id: number;
    name: string;
}

export interface ISpecializationsResponse {
    count: number;
    next: null;
    preview: null;
    results: ISpecialization[]
}

