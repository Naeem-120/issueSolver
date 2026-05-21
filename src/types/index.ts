export type TRole = "contributor"|"maintainer";
export const USER_ROLE = {
    contributor: "contributor",
    maintainer: "maintainer"
} as const;

export type TParameter = {
    sort: string;
    type?: string;
    status?: string;
}