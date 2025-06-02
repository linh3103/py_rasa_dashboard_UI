export type FormControl = {
    type: ControlType
    name: string
    label: string
    disable: boolean
}

export enum ControlType {
    text_field,
    select,
    text_area
}