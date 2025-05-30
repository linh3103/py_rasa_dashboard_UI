import { EntityExample } from "./EntityExample";

export type IntentExample = {
  id: number
  intent_id: number
  intent_name: string
  example: string
  description?: string
  entities: [EntityExample]
};